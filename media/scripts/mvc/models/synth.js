(function() {
  'use strict';
  
  bs.models.Synth = Backbone.Model.extend({
    initialize: function() {
      var synth = this;
      this.context = new webkitAudioContext();
      this.patches = new bs.collections.Patches();
      this.filter = new bs.models.Filter({type: 'lowpass'}, {context: this.context});
      this.oscillatorModule = new bs.models.OscillatorModule({}, {context: this.context});
      this.mixer = new bs.models.Mixer({}, {context: this.context});
      this.volumeEnvelope = new bs.models.Envelope({}, {context: this.context});
      this.filterEnvelope = new bs.models.Envelope({maxValue: 20000}, {context: this.context});
      this.delay = new bs.models.Delay({}, {context: this.context});
      this.keyboard = new bs.models.Keyboard();
      this.compressor = new bs.models.Compressor({}, {context: this.context});
      // this.metronome = new bs.models.Metronome({}, {context: this.context});
      // this.loopModule = new bs.models.LoopModule({metronome: this.metronome}, {context: this.context});
      this.masterGain = new bs.models.Gain({gain: 0}, {context: this.context});
      this.lfo = new bs.models.LFO({type: 'triangle', frequency: 5}, {context: this.context});

      // setup cv patches
      this.cvPatchSources = {
        'none': {title: 'None', node: null},
        'lfo': {title: 'LFO', node: this.lfo},
        'osc1': {title: 'Osc1', node: this.oscillatorModule.gain1},
        'osc2': {title: 'Osc2', node: this.oscillatorModule.gain2},
        'osc3': {title: 'Osc3', node: this.oscillatorModule.gain3},
        'noise': {title: 'Noise', node: this.mixer.whiteNoise.sourceNode},
        'venv': {title: 'Amp Envelope', node: this.volumeEnvelope},
        'fenv': {title: 'Filter Envelope', node: this.filterEnvelope}
      };
      
      this.cvPatchDestinations = {
        'none': {title: 'None', node: null},
        'flt': {title: 'Filter', node: this.filter.postNode.frequency},
        'fltres': {title: 'Filter Resonance', node: this.filter.postNode.Q},
        'dlt': {title: 'Delay Time', node: this.delay.node.delayTime},
        'dlg': {title: 'Delay Gain', node: this.delay.gainNode.gain},
        'osc1f': {title: 'Osc1 Frequency', node: this.oscillatorModule.osc1.node.frequency},
        'osc2f': {title: 'Osc2 Frequency', node: this.oscillatorModule.osc2.node.frequency},
        'osc3f': {title: 'Osc3 Frequency', node: this.oscillatorModule.osc3.node.frequency},
        'osc1d': {title: 'Osc1 Detune', node: this.oscillatorModule.osc1.node.detune},
        'osc2d': {title: 'Osc2 Detune', node: this.oscillatorModule.osc2.node.detune},
        'osc3d': {title: 'Osc3 Detune', node: this.oscillatorModule.osc3.node.detune},
        'osc1g': {title: 'Osc1 Gain', node: this.mixer.gain1.node.gain},
        'osc2g': {title: 'Osc2 Gain', node: this.mixer.gain2.node.gain},
        'osc3g': {title: 'Osc3 Gain', node: this.mixer.gain3.node.gain},
        'noise': {title: 'Noise', node: this.mixer.noiseGain.node},
        'lfo': {title: 'LFO', node: this.lfo.oscillatorNode.frequency},
        'mstrg': {title: 'Master Gain', node: this.masterGain.node.gain}
      };

      this.cvPatchModule = new bs.models.CVPatchModule({}, {context: this.context, patchSources: this.cvPatchSources, patchDestinations: this.cvPatchDestinations});

      
      // route node path
      this.oscillatorModule.connect(this.mixer);
      this.mixer.connect(this.filter.preNode);
      this.filterEnvelope.connect(this.filter.postNode.frequency);
      this.volumeEnvelope.connect(this.masterGain.node.gain);
      this.filter.connect(this.delay.node);
      this.filter.connect(this.compressor.compressor);
      this.delay.connect(this.compressor.compressor);
      this.compressor.connect(this.masterGain.node);
      // this.metronome.connect(this.masterGain.node);
      this.masterGain.node.connect(this.context.destination);
      // this.compressor.connect(this.loopModule.gain);
      
      this.lfo.start(0);
      this.patches.fetch({add: true,
        success: function(collection, res) {
          var patch = collection.findWhere({name: synth.get('patch')});
          if (patch) {
            synth.loadPatch(patch.get('parameters'));
          }
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
        // loopModule: this.loopModule.toJSON(),
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
