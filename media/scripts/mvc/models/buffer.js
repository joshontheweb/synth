(function() {
  'use strict';

  bs.models.Buffer = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.bufferNode = attrs.bufferNode || this.context.createBuffer(2, 4096, this.context.sampleRate);

      this.on('change:gain', this.gainChange);
      this.on('change:bufferNode', this.bufferNodeChange);
    },

    defaults: {
      'gain': 1
    },

    bufferNodeChange: function(model, bufferNode) {
      this.bufferNode = bufferNode;
    },

    gainChange: function(model, gain) {
      this.bufferNode.source.gain.value = gain;
    }
  });
})();
