(function() {
  'use strict';

  bs.models.Delay = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.node = this.context.createDelayNode();
      this.gainNode = this.context.createGainNode();

      this.gainNode.gain.value = 0.75;
      this.node.connect(this.gainNode);
      this.gainNode.connect(this.node);

      this.on('change:time', this.timeChange);
    },

    defaults: {
      'time': 0
    },

    timeChange: function(model, time) {
      this.node.delayTime.value = time;
    },
    
    connect: function(node) {
      this.node.connect(node);
    }
  });
})();
