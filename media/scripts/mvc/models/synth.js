(function() {
  'use strict';
  
  bs.models.Synth = Backbone.Model.extend({
    initialize: function() {
      var synth = this;
      this.context = new webkitAudioContext();
      this.patches = new bs.collections.Patches();
      this.filter = new bs.models.Filter({type: 'lowpass'}, {context: this.context});
      this.oscillatorModule = new bs.models.OscillatorModule({}, {context: this.context});
      this.volumeEnvelope = new bs.models.VolumeEnvelope({}, {context: this.context});
      this.filterEnvelope = new bs.models.FilterEnvelope({}, {context: this.context, filter: this.filter});
      this.delay = new bs.models.Delay({}, {context: this.context});
      this.keyboard = new bs.models.Keyboard();
      this.compressor = new bs.models.Compressor({}, {context: this.context});
      this.metronome = new bs.models.Metronome({}, {context: this.context});
      this.loopModule = new bs.models.LoopModule({metronome: this.metronome}, {context: this.context});
      this.masterGain = new bs.models.Gain({gain: .5}, {context: this.context});
      this.lfo = new bs.models.LFO({type: 'triangle', frequency: 5}, {context: this.context});

      // setup cv patches
      this.cvPatchSources = {
        'none': null,
        'lfo': this.lfo,
        'osc1': this.oscillatorModule.gain1,
        'osc2': this.oscillatorModule.gain2,
        'osc3': this.oscillatorModule.gain3
      };
      
      this.cvPatchDestinations = {
        'none': null,
        'filter': this.filter.postNode.frequency,
        'filter resonance': this.filter.postNode.Q,
        'delay time': this.delay.node.delayTime,
        'delay gain': this.delay.gainNode.gain,
        'osc1 frequency': this.oscillatorModule.osc1.node.frequency,
        'osc1 gain': this.oscillatorModule.gain1.node.gain,
        'osc2 frequency': this.oscillatorModule.osc2.node.frequency,
        'osc2 gain': this.oscillatorModule.gain2.node.gain,
        'osc3 frequency': this.oscillatorModule.osc3.node.frequency,
        'osc3 gain': this.oscillatorModule.gain3.node.gain,
        'lfo': this.lfo.oscillatorNode.frequency,
        'master gain': this.masterGain.node.gain
      };

      this.cvPatchModule = new bs.models.CVPatchModule({}, {context: this.context, patchSources: this.cvPatchSources, patchDestinations: this.cvPatchDestinations});

      
      // route node path
      this.oscillatorModule.connect(this.volumeEnvelope.node);
      this.volumeEnvelope.connect(this.filter.preNode);
      this.filter.connect(this.delay.node);
      this.filter.connect(this.compressor.compressor);
      this.delay.connect(this.compressor.compressor);
      this.compressor.connect(this.masterGain.node);
      this.metronome.connect(this.masterGain.node);
      this.masterGain.node.connect(this.context.destination);
      this.compressor.connect(this.loopModule.gain);
      
      this.lfo.start(0);
      this.patches.fetch({add: true,
        success: function(collection, res) {
          var patch = collection.findWhere({name: synth.get('patch')});
          synth.loadPatch(JSON.parse(patch.get('parameters')));
        }
      });

    },

    defaults: {
      patch: 'warm'
    },

    savePatch: function(name) {
      var jsonStr = JSON.stringify({
        filter: this.filter.toJSON(),
        oscillatorModule: this.oscillatorModule.toJSON(),
        volumeEnvelope: this.volumeEnvelope.toJSON(),
        filterEnvelope: this.filterEnvelope.toJSON(),
        delay: this.delay.toJSON(),
        keyboard: this.keyboard.toJSON(),
        compressor: this.compressor.toJSON(),
        // metronome: this.metronome.toJSON(),
        loopModule: this.loopModule.toJSON(),
        masterGain: this.masterGain.toJSON(),
        lfo: this.lfo.toJSON(),
        cvPatchModule: this.cvPatchModule.toJSON()
      });
      
      this.patches.create({name: name, parameters: JSON.parse(jsonStr)}, {
        wait: true,
        success: function(patch) {
          router.navigate(patch.get('name').replace(' ', '-'));
        }
      });
    },

    loadPatch: function(parameters) {
      var key;
      for (key in parameters) {
        if (parameters.hasOwnProperty(key)) {
          this[key].set(parameters[key]);
        }
      }
    }
  });
  
})();
