(function() {
  'use strict';

  bs.models.Oscillator = Backbone.Model.extend({
    initialize: function(options) {
      this.context = options.context || new webkitCreateAudioContext();
      this.oscillator = this.context.createOscillator();

      this.on('change:type', this.typeChange);
      this.on('change:frequency', this.frequencyChange);
      this.on('change:detune', this.detuneChange);
      
      this.oscillator.type = this.get('type');
      this.oscillator.frequency.value = this.get('frequency');
      this.oscillator.detune = this.get('detune');
    },

    defaults: {
      'type': 'sawtooth',
      'frequency': 440,
      'detune': 0
    },

    frequencyChange: function(model, freq) {
      this.oscillator.frequency.value = freq;
    },

    typeChange: function(model, waveform) {
      this.oscillator.type = waveform;
    },

    detuneChange: function(model, detune) {
      this.oscillator.detune.value = detune;
    },

    start: function(time) {
      this.oscillator.start(time);
    },

    connect: function(node) {
      this.oscillator.connect(node);
    }
  });
  
})();
