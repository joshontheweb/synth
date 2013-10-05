(function() {
  'use strict';

  bs.models.Envelope = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.gainNode = this.node = this.context.createGainNode();
      this.valueSource = this.context.createScriptProcessor(16384);
      
      this.valueSource.onaudioprocess = function(e) {
        var input = e.inputBuffer.getChannelData(0);
        var output = e.outputBuffer.getChannelData(0);
        for (var i = 0; i < input.length; i++) { 
          output[i] = 1;
        }
      }
      
      this.valueSource.connect(this.gainNode);
      this.gainNode.gain.value = this.get('gain');
    },

    defaults: {
      'maxValue': 1,
      'gain': 0,
      'attack': 0.01,
      'decay': 0.2,
      'sustain': 0.8,
      'release': 0.2
    },

    triggerAttack: function() {
      var now = this.context.currentTime;

      this.gainNode.gain.cancelScheduledValues(now);
      this.gainNode.gain.setTargetAtTime(this.get('maxValue'), now, this.get('attack'));
        
      this.gainNode.gain.setTargetAtTime(this.get('sustain'), now + this.get('attack'), this.get('decay'));
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
