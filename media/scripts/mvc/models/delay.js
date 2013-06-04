(function() {
  'use strict';

  bs.models.Delay = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.node = this.context.createDelayNode();
      this.delay2Node = this.context.createDelayNode();
      this.gainNode = this.context.createGainNode();
      this.gain2Node = this.context.createGainNode();

      this.gainNode.gain.value = this.get('gain');
      this.gain2Node.gain.value = this.get('gain');
      
      this.node.connect(this.gainNode);
      this.gainNode.connect(this.delay2Node);
      this.delay2Node.connect(this.gain2Node);
      this.gain2Node.connect(this.node);

      this.on('change:time', this.timeChange);
      this.on('change:gain', this.gainChange);
    },

    defaults: {
      'time': 0,
      'gain': 0.75
    },

    timeChange: function(model, time) {
      this.node.delayTime.value = time;
      this.delay2Node.delayTime.value = time;
    },

    gainChange: function(model, gain) {
      this.gainNode.gain.value = gain;
    },
    
    connect: function(node) {
      this.node.connect(node);
      this.delay2Node.connect(node);
    }
  });
})();
