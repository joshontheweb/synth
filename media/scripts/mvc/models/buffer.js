(function() {
  'use strict';

  bs.models.Buffer = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.bufferNode = attrs.bufferNode || this.context.createBuffer(2, 4096, this.context.sampleRate);

      this.on('change:gain', this.gainChange);
    },

    defaults: {
      'gain': 1
    },

    gainChange: function(model, gain) {
      this.bufferNode.source.gain.value = gain;
    }
  });
})();
