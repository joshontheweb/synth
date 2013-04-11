(function() {
  'use strict';

  bs.models.VolumeEnvelope = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = attrs.context;
      this.gainNode = this.context.createGainNode();
      this.gainNode.gain.value = this.get('gain');
    },

    defaults: {
      'gain': 0,
      'attack': 0,
      'decay': 0.2,
      'sustain': 0.8,
      'release': 0.2
    },

    triggerAttack: function() {
      var now = this.context.currentTime;

      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setValueAtTime(0, now);
      this.gainNode.gain.linearRampToValueAtTime(1, now + this.get('attack'));
        
      now += this.get('attack');
      this.gainNode.gain.linearRampToValueAtTime(this.get('sustain'), now + this.get('decay'));
    },

    triggerRelease: function() {
      var now = this.context.currentTime;
      
      // this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.linearRampToValueAtTime(0, now + this.get('release'));
    },

    connect: function(node) {
      this.gainNode.connect(node);
    }
  });
})();
