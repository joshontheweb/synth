(function() {
  'use strict';

  bs.models.Delay = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.delayNode = this.context.createDelayNode();
      this.gainNode = this.context.createGainNode();

      this.gainNode.gain.value = 0.75;
      this.delayNode.connect(this.gainNode);
      this.gainNode.connect(this.delayNode);

      this.on('change:time', this.timeChange);
    },

    defaults: {
      'time': 0
    },

    timeChange: function(model, time) {
      this.delayNode.delayTime.value = time;
    },
    
    connect: function(node) {
      this.delayNode.connect(node);
    }
  });
})();
