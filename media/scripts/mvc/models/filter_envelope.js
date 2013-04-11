(function() {
  'use strict';

  bs.models.FilterEnvelope = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = attrs.context;
      this.filter = this.context.createBiquadFilter();
    },

    defaults: {
      'attack': 0,
      'decay': 0.2,
      'sustain': 20000,
      'release': 0.2
    },

    triggerAttack: function() {
      var now = this.context.currentTime;

      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.setValueAtTime(0, now);
      this.filter.frequency.linearRampToValueAtTime(20000, now + this.get('attack'));
        
      now += this.get('attack');
      this.filter.frequency.linearRampToValueAtTime(this.get('sustain'), now + this.get('decay'));
    },

    triggerRelease: function() {
      var now = this.context.currentTime;
      
      // this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.linearRampToValueAtTime(0, now + this.get('release'));
    },

    connect: function(node) {
      this.filter.connect(node);
    }
  });
})();
