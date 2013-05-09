(function() {
  'use strict';

  bs.models.Buffer = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.bufferNode = attrs.bufferNode || this.context.createBuffer(2, 4096, this.context.sampleRate);

      this.on('change:gain', this.gainChange);
      this.on('change:bufferNode', this.bufferNodeChange);

      this.listenTo(synth.metronome, 'change:tempo', this.updateSourcePlaybackRate);
    },

    defaults: {
      'gain': 1
    },

    bufferNodeChange: function(model, bufferNode) {
      this.bufferNode = bufferNode;
    },

    gainChange: function(model, gain) {
      this.bufferNode.source.gain.value = gain;
    },

    updateSourcePlaybackRate: function() {
      var source = this.bufferNode.source;
      console.log(source);
      console.log('tempo', synth.metronome.get('tempo'), 'buffer tempo', this.get('tempo'))
      source.playbackRate.value = synth.metronome.get('tempo') / this.get('tempo');
    }
  });
})();
