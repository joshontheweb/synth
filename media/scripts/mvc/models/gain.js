(function() {
  'use strict';

  bs.models.Gain = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.node = this.context.createGainNode();

      this.on('change:gain', this.gainChange);
      
      this.node.gain.value = this.get('gain');
    },

    defaults: {
      'gain': 1
    },

    gainChange: function(model, gain) {
      this.node.gain.value = gain;
    },

    connect: function(node) {
      this.node.connect(node);
    }
  });
})();
