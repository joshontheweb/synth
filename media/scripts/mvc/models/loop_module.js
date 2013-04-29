(function() {
  'use strict';

  bs.models.LoopModule = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.gain = this.context.createGainNode();
      this.buffers = new Backbone.Collection();
      this.buffers.model = bs.models.Buffer;
      this.metronome = attrs.metronome;
      this.sources = []

      this.schedule = {};

      this.listenTo(this.metronome, 'beat', this.beat);
      
      _.bindAll(this);
    },

    beat: function(beat) {
      if (this.schedule[beat.number]) {
        this.schedule[beat.number](beat.time);
      }
    },
    
    startRecording: function() {
      var model = this;
      this.schedule[0] = function(time) {
        model.recording = true;
        model.recorder = new Recorder(model.gain, {workerPath: '/media/scripts/libs/recorder_worker.js', bufferLen: 1024});
        // console.log('started recording', time, 'current time', model.context.currentTime);
        model.recorder.record(time);
        this[0] = null;
      }
    },

    getBufferCallback: function(buffers, time) {
      var model = this;
      var newSource = this.context.createBufferSource();
      var newBuffer = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
      newBuffer.getChannelData(0).set(buffers[0]);
      newBuffer.getChannelData(1).set(buffers[1]);
      newSource.buffer = newBuffer;

      newSource.connect(this.context.destination);
      // newSource.loop = true;
      // newSource.loopStart = this.context.currentTime - time;
      var offset = this.context.currentTime - time;
      // console.log('current time', this.context.currentTime, 'offset', offset, 'time', time);
      newSource.start(0, offset);
      this.schedule[0] = function(time) {
        model.buffers.each(function(buffer) {
          var source = model.context.createBufferSource();
          source.buffer = buffer.get('bufferNode');
          source.connect(synth.masterGain.gainNode);
          console.log('current time', model.context.currentTime, 'time', time);
          source.start(time);
        });
      }
      var buffer = new bs.models.Buffer({bufferNode: newBuffer, source: newSource});
      this.buffers.add(buffer);
    },

    stopRecording: function() {
      var model = this;
      this.schedule[0] = function(time) {
        // console.log('stop recording', time, 'current time', model.context.currentTime);
        model.recorder.stop(time);
        // console.log(time, model.context.currentTime, time - model.context.currentTime, (time - model.context.currentTime)*1000);
        setTimeout(function() {
          model.recorder.getBuffer(function(buffers) {
            model.getBufferCallback(buffers, time);
          });
          model.recording = false;
          model.schedule[0] = null;
        }, (time - model.context.currentTime) * 1000);
      }
    }
  });
})();
