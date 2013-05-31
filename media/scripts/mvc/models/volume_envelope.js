(function() {
  'use strict';

  bs.models.VolumeEnvelope = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.gainNode = this.node = this.context.createGainNode();
      this.gainNode.gain.value = this.get('gain');
    },

    defaults: {
      'gain': 0,
      'attack': .01,
      'decay': 0.2,
      'sustain': 0.8,
      'release': 0.2
    },

    triggerAttack: function() {
      var now = this.context.currentTime;

      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(1, now, this.get('attack'));
        
      now += this.get('attack');
      this.gainNode.gain.setTargetAtTime(this.get('sustain'), now, this.get('decay'));
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
