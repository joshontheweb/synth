(function() {
  'use strict';

  bs.models.LoopModule = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.gain = this.context.createGainNode();
      this.buffers = new Backbone.Collection();
      this.buffers.model = bs.models.Buffer;
      this.sources = []

      _.bindAll(this);
    },
    
    startRecording: function() {
      this.recorder = new Recorder(this.gain, {workerPath: '/media/scripts/libs/recorder_worker.js'});
      this.recorder.record();
    },

    getBufferCallback: function(buffers) {
      var newSource = this.context.createBufferSource();
      var newBuffer = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
      newBuffer.getChannelData(0).set(buffers[0]);
      newBuffer.getChannelData(1).set(buffers[1]);
      newSource.buffer = newBuffer;

      newSource.connect(this.context.destination);
      newSource.loop = true;
      newSource.start(0);
      var buffer = new bs.models.Buffer({buffer: newBuffer, source: newSource});
      this.buffers.add(buffer);
    },

    stopRecording: function() {
      this.recorder.stop();
      this.recorder.getBuffer(this.getBufferCallback);
      this.recorder = false;
    }
  });
})();
