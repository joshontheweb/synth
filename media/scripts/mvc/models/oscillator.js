(function() {
  'use strict';

  bs.models.Oscillator = Backbone.Model.extend({
    initialize: function(options) {
      this.context = options.context || new webkitCreateAudioContext();
      this.node = this.context.createOscillator();

      this.on('change:type', this.typeChange);
      this.on('change:frequency', this.frequencyChange);
      this.on('change:detune', this.detuneChange);
      
      this.node.type = this.get('type');
      this.node.frequency.value = this.get('frequency');
      this.node.detune = this.get('detune');
    },

    defaults: {
      'type': 'sawtooth',
      'frequency': 440,
      'detune': 0,
    },

    frequencyChange: function(model, freq) {
      this.node.frequency.value = freq;
    },

    typeChange: function(model, waveform) {
      this.node.type = waveform;
    },

    detuneChange: function(model, detune) {
      this.node.detune.value = detune;
    },

    start: function(time) {
      this.node.start(time);
    },

    connect: function(node) {
      this.node.connect(node);
    },

    disconnect: function() {
      this.node.disconnect();
    }
  });
  
})();
