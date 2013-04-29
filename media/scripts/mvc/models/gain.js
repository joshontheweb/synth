(function() {
  'use strict';

  bs.models.Gain = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.gainNode = this.context.createGainNode();

      this.on('change:gain', this.gainChange);
      
      this.gainNode.gain.value = this.get('gain');
    },

    defaults: {
      'gain': 1
    },

    gainChange: function(model, gain) {
      this.gainNode.gain.value = gain;
    },

    connect: function(node) {
      this.gainNode.connect(node);
    }
  });
})();
