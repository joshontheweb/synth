(function() {
  'use strict';

  bs.models.Delay = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.delayNode = this.context.createDelayNode();
      this.gainNode = this.context.createGainNode();

      this.gainNode.gain.value = 0.75;
      this.delayNode.connect(this.gainNode);
      this.gainNode.connect(this.delayNode);
    },

    defaults: {
      'time': 0
    },
    
    connect: function(node) {
      this.delayNode.connect(node);
    }
  });
})();
