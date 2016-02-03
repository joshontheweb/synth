(function() {
  'use strict';

  bs.models.Buffer = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.bufferNode = attrs.bufferNode || this.context.createBuffer(2, 4096, this.context.sampleRate);
      this.gain = this.context.createGain();
      this.on('change:gain', this.gainChange);
      this.on('change:bufferNode', this.bufferNodeChange);

      this.listenTo(synth.metronome, 'change:tempo', this.updateSourcePlaybackRate);
    },

    defaults: {
      'gain': 1
    },

    uploadBuffer: function(name) {
      var formData = new FormData();

      formData.append('apiKey', '$2a$10$.Jnu2qCTKz2H4Ett4cJyUet7Oe2dlVP.5l95aPnJflUtVYUlINGLK');
      formData.append('projectID', null);
      formData.append('track', JSON.stringify(new bs.models.Loop({bpm: this.get('tempo')}).toJSON()));
      formData.append( 'audio', this.get('wav'), name + '.wav');

      var xhr = new XMLHttpRequest();
      xhr.open('POST', 'http://soundkeep.com/upload', true);
      xhr.withCredentials = true;
      xhr.onload = function(e) {
        console.log('hooray', e);
      };

      // Listen to the upload progress.
      // var progressBar = document.querySelector('progress');
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          console.log('progress', e);
          // progressBar.value = (e.loaded / e.total) * 100;
          // progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
        }
      }

      xhr.send(formData);
    },

    bufferNodeChange: function(model, bufferNode) {
      this.bufferNode = bufferNode;
    },

    gainChange: function(model, gain) {
      this.gain.value = gain;
    },

    updateSourcePlaybackRate: function() {
      var source = this.bufferNode.source;
      console.log(source);
      console.log('tempo', synth.metronome.get('tempo'), 'buffer tempo', this.get('tempo'))
      source.playbackRate.value = synth.metronome.get('tempo') / this.get('tempo');
    }
  });
})();
