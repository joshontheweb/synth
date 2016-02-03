(function() {
  'use strict';

  bs.models.LFO = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context || new webkitCreateAudioContext();
      this.oscillatorNode = this.context.createOscillator();
      this.gainNode = this.context.createGain();

      this.oscillatorNode.connect(this.gainNode);

      this.on('change:type', this.typeChange);
      this.on('change:frequency', this.frequencyChange);
      this.on('change:detune', this.detuneChange);
      this.on('change:gain', this.gainChange);

      this.oscillatorNode.type = this.get('type');
      this.oscillatorNode.frequency.value = this.get('frequency');
      this.oscillatorNode.detune.value = this.get('detune');
      this.gainNode.gain.value = this.get('gain');
    },

    defaults: {
      'type': 'sawtooth',
      'frequency': 440,
      'detune': 0,
      'gain': .5,
      'maxGain': 1
    },

    frequencyChange: function(model, freq) {
      this.oscillatorNode.frequency.value = freq;
    },

    typeChange: function(model, waveform) {
      this.oscillatorNode.type = waveform;
    },

    detuneChange: function(model, detune) {
      this.oscillatorNode.detune.value = detune;
    },

    gainChange: function(model, gain) {
      this.gainNode.gain.value = gain;
      console.log('lfo gain', gain);
    },

    start: function(time) {
      this.oscillatorNode.start(time);
    },

    connect: function(node, index) {
      this.gainNode.connect(node, index);
    },

    disconnect: function(index) {
      this.gainNode.disconnect(index);
    }
  });

})();
