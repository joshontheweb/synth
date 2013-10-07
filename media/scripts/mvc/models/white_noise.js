(function() {
  'use strict';

  bs.models.WhiteNoise = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      
      this.generateWhiteNoiseBuffer();
      this.createSourceNode();
      this.startWhiteNoise();
    },

    generateWhiteNoiseBuffer: function() {
      // Generate a 5 second white noise buffer.
      var lengthInSamples = 5 * this.context.sampleRate;
      this.buffer = this.context.createBuffer(1, lengthInSamples, this.context.sampleRate);
      var data = this.buffer.getChannelData(0);

      for (var i = 0; i < lengthInSamples; i++) {
        data[i] = ((Math.random() * 2) - 1);
      }
    },

    createSourceNode: function() {
      // Create a source node from the buffer.
      this.sourceNode = this.context.createBufferSource();
      this.sourceNode.buffer = this.buffer;
    },

    startWhiteNoise: function() {
      this.sourceNode.loop = true;
      this.sourceNode.start(0);
    },

    connect: function(node) {
      this.sourceNode.connect(node);
    }
  });
})();
