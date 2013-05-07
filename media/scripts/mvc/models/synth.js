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
      this.filterEnvelope = new bs.models.FilterEnvelope({filter: this.filter}, {context: this.context});
      this.delay = new bs.models.Delay({}, {context: this.context});
      this.keyboard = new bs.models.Keyboard();
      this.compressor = new bs.models.Compressor({}, {context: this.context});
      this.metronome = new bs.models.Metronome({}, {context: this.context});
      this.loopModule = new bs.models.LoopModule({metronome: this.metronome}, {context: this.context});
      this.masterGain = new bs.models.Gain({gain: .5}, {context: this.context});
      this.lfo = new bs.models.LFO({type: 'triangle', frequency: 5}, {context: this.context});

      this.cvPatchSources = {
        'lfo': this.lfo
      };
      
      this.cvPatchDestinations = {
        'filter': this.filter.node.frequency,
        'master gain': this.masterGain.node.gain
      };

      this.cvPatch = new bs.models.CVPatch({sources: this.cvPatchSources, destinations: this.cvPatchDestinations}, {context: this.context});
      
      this.oscillatorModule.connect(this.volumeEnvelope.node);
      this.volumeEnvelope.connect(this.filter.node);
      this.filter.connect(this.filterEnvelope.filterNode);
      this.filterEnvelope.connect(this.compressor.compressor);
      this.filterEnvelope.connect(this.delay.delayNode);
      this.delay.connect(this.compressor.compressor);
      this.compressor.connect(this.masterGain.node);
      this.metronome.connect(this.masterGain.node);
      this.masterGain.node.connect(this.context.destination);
      this.compressor.connect(this.loopModule.gain);
      
      this.lfo.start(0);
      this.patches.fetch({add: true});
      
    },

    savePatch: function() {
      var jsonStr = JSON.stringify({
        filter: this.filter.toJSON(),
        oscillatorModule: this.oscillatorModule.toJSON(),
        volumeEnvelope: this.volumeEnvelope.toJSON(),
        filterEnvelope: this.filterEnvelope.toJSON(),
        delay: this.delay.toJSON(),
        keyboard: this.keyboard.toJSON(),
        compressor: this.compressor.toJSON(),
        metronome: this.metronome.toJSON(),
        loopModule: this.loopModule.toJSON(),
        masterGain: this.masterGain.toJSON(),
        lfo: this.lfo.toJSON()
      });
      
      this.patches.create({id: this.patches.length, parameters: JSON.parse(jsonStr)}, {wait: true});
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
