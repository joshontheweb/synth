(function() {
  'use strict';

  bs.views.SynthView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model.keyboard, 'keyDown', this.handleKeyDown);
      this.listenTo(this.model.keyboard, 'keyUp', this.handleKeyUp);
    },
    
    template: _.template($('.synth-template').html()),

    handleKeyDown: function(note, freq) {
      this.model.oscillatorModule.set({frequency: freq});
      this.model.volumeEnvelope.triggerAttack();
      this.model.filterEnvelope.triggerAttack();
    },
    
    handleKeyUp: function(note, freq) {
      if (!this.model.keyboard.pressed) {
        this.model.volumeEnvelope.triggerRelease();
        this.model.filterEnvelope.triggerRelease();
      }
    },

    renderPatches: function() {
      this.patchesView = new bs.views.PatchesView({collection: this.model.patches});
      this.$('.patches').append(this.patchesView.render().el);
    },

    renderFilter: function() {
      this.filterView = new bs.views.FilterView({model: this.model.filter});
      this.$('.filter').append(this.filterView.render().el);
    },

    renderOscillatorModule: function() {
      this.oscillatorView = new bs.views.OscillatorModuleView({model: this.model.oscillatorModule});
      this.$('.oscillator-module').append(this.oscillatorView.render().el);
    },

    renderKeyboard: function() {
      this.keyboardView = new bs.views.KeyboardView({model: this.model.keyboard});
      this.$el.append(this.keyboardView.render().el);
    },

    renderOscilloscope: function() {
      this.model.oscilloscope = new WavyJones(this.model.context, 'oscilloscope');
      this.model.compressor.connect(this.model.oscilloscope);
    },

    renderVolumeEnvelope: function() {
      this.envelopeView = new bs.views.EnvelopeView({model: this.model.volumeEnvelope});
      this.$('.volume-envelope').append(this.envelopeView.render().el);
    },

    renderFilterEnvelope: function() {
      this.envelopeView = new bs.views.EnvelopeView({model: this.model.filterEnvelope, template: _.template($('.filter-envelope-template').html())});
      this.$('.filter-envelope').append(this.envelopeView.render().el);
    },

    renderDelay: function() {
      this.delayView = new bs.views.DelayView({model: this.model.delay});
      this.$('.delay').append(this.delayView.render().el);
    },

    renderLfo: function() {
      this.oscillatorView = new bs.views.LfoView({model: this.model.lfo});
      this.$('.lfo').append(this.oscillatorView.render().el);
    },

    renderLoopModule: function() {
      this.loopModuleView = new bs.views.LoopModuleView({model: this.model.loopModule});
      this.$('.loop-module').append(this.loopModuleView.render().el);
    },

    renderMetronome: function() {
      this.metronomeView = new bs.views.MetronomeView({model: this.model.metronome});
      this.$('.metronome').html(this.metronomeView.render().el);
    },
    
    renderCVPatches: function() {
      this.cvPatchModuleView = new bs.views.CVPatchModuleView({model: this.model.cvPatchModule});
      this.$('.cv-patches').html(this.cvPatchModuleView.render().el);
    },

    initMidi: function() {
      var view = this;
      var midi = null;   // m = MIDIAccess object for you to make calls on
      navigator.requestMIDIAccess( onsuccesscallback, function(err) {console.log('err', err)} );
      var startVal;
      var moving;
      var movingKeyCode;

      function onsuccesscallback( access ) { 
          midi = access;
          
          // hax to hide jazz plugin, what a pain
          $('object').css({'opacity': 0, position: 'absolute', left: -1000});

          // Things you can do with the MIDIAccess object:
          var inputs = midi.getInputs();   // inputs = array of MIDIPorts
          var outputs = midi.getOutputs(); // outputs = array of MIDIPorts
          var i = midi.getInput( inputs[0] );    // grab first input device.  You can also just call getInput( index );
          i.onmessage = function(e) {
            console.log(e.data);
            var keyCode = e.data[1];
            var value = e.data[2];
            
            if (moving && movingKeyCode == keyCode) {
              if (this.moveTimeout) {
                clearInterval(this.moveTimeout);
              }
              this.moveTimeout = setTimeout(function() {
                moving = false;
              }, 2000);
            } else {
              startVal = 0;
              moving = true;
              movingKeyCode = keyCode;
            }
            
            
            // if a key is pressed send it to the keyboard
            if (keyCode >= 48 && keyCode <= 72) {
              view.model.keyboard.keyboard.midiIn(e);
            }

            else if (keyCode == 119) { // rec
              var loopModule = view.model.loopModule
              if (loopModule.recording) {
                loopModule.stopRecording();
              } else {
                loopModule.startRecording();
              }
            }

            // control knobs
            // Bank A

            // oscillator waveforms
            else if (keyCode == 22) { // K1
              var knob = synth.oscillatorModule.osc1.waveformKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            else if (keyCode == 23) { // K2
              var knob = synth.oscillatorModule.osc2.waveformKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            else if (keyCode == 24) { // K3
              var knob = synth.oscillatorModule.osc3.waveformKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            // oscillator detune
            else if (keyCode == 26) { // K5
              var knob = synth.oscillatorModule.osc1.detuneKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }
            
            else if (keyCode == 27) { // K6
              var knob = synth.oscillatorModule.osc2.detuneKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }
            
            else if (keyCode == 28) { // K7
              var knob = synth.oscillatorModule.osc3.detuneKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            // oscillator gain
            else if (keyCode == 12) { // K9
              var knob = synth.oscillatorModule.gain1Knob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }
            
            else if (keyCode == 13) { // K10
              var knob = synth.oscillatorModule.gain2Knob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }
            
            else if (keyCode == 14) { // K11
              var knob = synth.oscillatorModule.gain3Knob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            // delay time
            else if (keyCode == 25) { // K4
              var knob = synth.delay.timeKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }   

            // filter cutoff
            else if (keyCode == 29) { // K8
              var knob = synth.filter.frequencyKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            else if (keyCode == 15) { // K12
              var knob = synth.lfo.frequencyKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            
            // Bank B
            
            // delay time
            else if (keyCode == 30) { // K4
              var knob = synth.delay.timeKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }    

            // delay gain
            else if (keyCode == 31) { // K4
              var knob = synth.delay.gainKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }    
            
            // filter cutoff
            else if (keyCode == 32) { // K4
              var knob = synth.filter.frequencyKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }    

            // filter resonance
            else if (keyCode == 33) { // K4
              var knob = synth.filter.resonanceKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }

            // lfo waveform gain
            else if (keyCode == 34) { // K4
              var knob = synth.lfo.waveformKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }    
            
            // lfo frequency
            else if (keyCode == 35) { // K4
              var knob = synth.lfo.frequencyKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }    

            // lfo gain
            else if (keyCode == 36) { // K4
              var knob = synth.lfo.gainKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }    
            
            // tempo
            else if (keyCode == 16) { // K4
              var knob = synth.metronome.tempoKnob;
              var value = mapKnobValue(knob, value);
              knob.set({'value': value});
            }    
          } // onmessage( event ), event.data & event.timestamp are populated

          var mapKnobValue = function(knob, value) {
            var valDiff = Math.abs(startVal - value);

            // minute adjust if shift key is held
            var valRange = 127;
            
            var min = knob.get('min');
            var max = knob.get('max');
            var decimal = knob.get('decimalPlace');

            var range = Math.abs(max - min);
      
            var value = (valDiff / valRange) * range;
            value += min;
            console.log('valdiff', valDiff, 'valRange', valRange, 'range', range, 'value', value, 'startVal', startVal);
            value += new Number(startVal);

            if (value >= max) {
              return max;
            } else if (value <= min) {
              return min
            } else {
              return Math.round(value * decimal) / decimal;
            }
      
          }
      }
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      this.renderPatches();
      this.renderFilter();
      this.renderOscillatorModule();
      this.renderKeyboard();
      this.renderOscilloscope();
      this.renderVolumeEnvelope();
      this.renderFilterEnvelope();
      this.renderDelay();
      this.renderLfo();
      this.renderLoopModule();
      this.renderMetronome();
      this.renderCVPatches();

      // this.initMidi();
      
      return this;
    }
  });
})();
