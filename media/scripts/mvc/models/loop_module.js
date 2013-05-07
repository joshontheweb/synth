(function() {
  'use strict';

  bs.models.LoopModule = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.gain = this.context.createGainNode();
      this.buffers = new Backbone.Collection();
      this.buffers.model = bs.models.Buffer;
      this.metronome = attrs.metronome;
      this.sources = [];
      this.scheduled = [];

      this.listenTo(this.metronome, 'beat', this.beat);
      
      _.bindAll(this);
    },

    beat: function(beat) {
      var model = this;
      _.each(this.scheduled, function(ev) {
        if (((beat.number % ev.numBeats) - (ev.startBeat % ev.numBeats) === 0)) {
          console.log('scheduling', ev, 'beat', beat);
          ev.callback(beat);
          
          if (ev.once) {
            // remove event from schedule event
            model.scheduled.splice(model.scheduled.indexOf(ev), 1);
          }
        }
      });
    },

    toggleBufferVolume: function(sourceIndex) {
      var buffer = this.buffers.at(sourceIndex);
      var gain = buffer.get('gain') ? 0: 1;
      buffer.set({'gain': gain});
    },
    
    startRecording: function() {
      var model = this;
      // var newBuffer = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
      var bufferModel = new bs.models.Buffer({context: this.context});
      var drawCallback = function(chan0, chan1) {
        bufferModel.trigger('draw', [chan0, chan1]);
      }
      this.scheduled.push(
        {
          startBeat: 0,
          numBeats: 16, 
          once: true,
          callback: function(beat) {
            model.recording = true;
            model.recorder = new Recorder(model.gain, drawCallback, bufferModel, {workerPath: '/media/scripts/libs/recorder_worker.js', bufferLen: 2048});
            console.log('started recording', beat.time, 'current time', model.context.currentTime);
            model.recorder.record(beat.time);
        }
      });
      this.buffers.add(bufferModel);
    },

    getBufferCallback: function(buffers, beat) {
      var model = this;
      var newSource = this.context.createBufferSource();
      var bufferNode = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
      var bufferModel = this.recorder.bufferModel;
      bufferNode.getChannelData(0).set(buffers[0]);
      bufferNode.getChannelData(1).set(buffers[1]);
      newSource.buffer = bufferNode;


      // try and smooth end of buffers to beginning value.
      // var offset = 0; 
      // var offset1 = 0;
      // var spread = 4096;
      // for (var i = buffers[0].length - spread; i <= buffers[0].length; i++) {
      //   offset += ((buffers[0][0] - buffers[0][buffers[0].length - 1]) / spread);
      //   offset1 += ((buffers[1][0] - buffers[1][buffers[1].length - 1]) / spread);
      //   buffers[0][i] = offset;
      //   buffers[1][i] = offset1;
      // }
      

      newSource.connect(synth.masterGain.node);
      // newSource.loop = true;
      // newSource.loopStart = this.context.currentTime - time;
      var offset = this.context.currentTime - beat.time;
      // console.log('current time', this.context.currentTime, 'offset', offset, 'time', time);
      newSource.start(0, offset);

      // derive the length in beats based on the length of the buffer
      var numBeats = Math.round((buffers[0].length / model.context.sampleRate) / (60 / synth.metronome.get('tempo'))) * 4;

      bufferModel.set({numBeats: numBeats, startBeat: beat.number, 'source': newSource, bufferNode: bufferNode});
      
      var loopTrigger = {
        startBeat: beat.number,
        numBeats: numBeats,
        callback: function(beat) {
          var source = model.context.createBufferSource();
          source.gain.value = bufferModel.get('gain');
          source.buffer = bufferModel.bufferNode;
          bufferNode.source = source;  // bad idea?
          source.connect(synth.masterGain.node);
          // console.log('current time', model.context.currentTime, 'time', time);
          source.start(beat.time);
        }
      }
      bufferModel.trigger('doneRecording');
      this.scheduled.push(loopTrigger);
      loopTrigger.id = bufferModel.cid;
    },

    stopRecording: function() {
      var model = this;
      this.scheduled.push({
        startBeat: 0,
        numBeats: 16,
        once: true,
        callback: function(beat) {
          // console.log('stop recording', time, 'current time', model.context.currentTime);
          model.recorder.stop(beat.time);
          // console.log(time, model.context.currentTime, time - model.context.currentTime, (time - model.context.currentTime)*1000);
          setTimeout(function() {
            model.recorder.getBuffer(function(buffers) {
              model.getBufferCallback(buffers, beat);
            });
            model.recording = false;
          }, (beat.time - model.context.currentTime) * 1000);
        }
      });
    }
  });
})();
