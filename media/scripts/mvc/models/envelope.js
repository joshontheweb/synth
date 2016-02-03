(function() {
  'use strict';

  bs.models.Envelope = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.gainNode = this.node = this.context.createGain();

      this.generateBuffer();
      this.createSourceNode();
      this.startSourceNode();

      this.sourceNode.connect(this.gainNode);
      this.gainNode.gain.value = this.get('gain');
    },

    defaults: {
      'maxValue': 1,
      'gain': 0,
      'attack': 0.01,
      'decay': 0.2,
      'sustain': 0.8,
      'release': 0.2
    },

    generateBuffer: function() {
      // Generate a 5 second white noise buffer.
      var lengthInSamples = 5 * this.context.sampleRate;
      this.buffer = this.context.createBuffer(1, lengthInSamples, this.context.sampleRate);
      var data = this.buffer.getChannelData(0);

      for (var i = 0; i < lengthInSamples; i++) {
        data[i] = 1;
      }
    },

    createSourceNode: function() {
      // Create a source node from the buffer.
      this.sourceNode = this.context.createBufferSource();
      this.sourceNode.buffer = this.buffer;
    },

    startSourceNode: function() {
      this.sourceNode.loop = true;
      this.sourceNode.start(0);
    },

    triggerAttack: function() {
      var now = this.context.currentTime;

      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(this.get('maxValue'), now, this.get('attack'));

      this.gainNode.gain.setTargetAtTime(this.get('sustain'), now + this.get('attack'), this.get('decay'));
    },

    triggerRelease: function() {
      var now = this.context.currentTime;
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(0, now, this.get('release'));
    },

    connect: function(node) {
      this.gainNode.connect(node);
    }
  });
})();
