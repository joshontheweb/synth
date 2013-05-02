(function() {
  'use strict';

  bs.models.LoopModule = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
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
        if (beat.number % ev.beat == 0) {
          console.log('scheduling', ev, 'beat', beat);
          ev.callback(beat.time);
          
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
      this.scheduled.push(
        {
          beat: 16, 
          once: true,
          callback: function(time) {
            model.recording = true;
            model.recorder = new Recorder(model.gain, {workerPath: '/media/scripts/libs/recorder_worker.js', bufferLen: 1024});
            console.log('started recording', time, 'current time', model.context.currentTime);
            model.recorder.record(time);
        }
      });
    },

    getBufferCallback: function(buffers, time) {
      var model = this;
      var newSource = this.context.createBufferSource();
      var newBuffer = this.context.createBuffer(2, buffers[0].length, this.context.sampleRate);
      newBuffer.getChannelData(0).set(buffers[0]);
      newBuffer.getChannelData(1).set(buffers[1]);
      newSource.buffer = newBuffer;
      

      newSource.connect(synth.masterGain.node);
      // newSource.loop = true;
      // newSource.loopStart = this.context.currentTime - time;
      var offset = this.context.currentTime - time;
      // console.log('current time', this.context.currentTime, 'offset', offset, 'time', time);
      newSource.start(0, offset);

      // derive the beat based on the length of the buffer
      var beat = Math.round((buffers[0].length / model.context.sampleRate) / (60 / synth.metronome.get('tempo'))) * 4;

      var bufferModel = new bs.models.Buffer({bufferNode: newBuffer, source: newSource, beat: beat});
      
      var loopTrigger = {
        beat: beat,
        callback: function(time) {
          var source = model.context.createBufferSource();
          source.gain.value = bufferModel.get('gain');
          source.buffer = bufferModel.bufferNode;
          newBuffer.source = source;  // bad idea?
          source.connect(synth.masterGain.node);
          // console.log('current time', model.context.currentTime, 'time', time);
          source.start(time);
        }
      }
      
      this.scheduled.push(loopTrigger);
      loopTrigger.id = bufferModel.cid;
      this.buffers.add(bufferModel);
    },

    stopRecording: function() {
      var model = this;
      this.scheduled.push({
        beat: 16,
        once: true,
        callback: function(time) {
          // console.log('stop recording', time, 'current time', model.context.currentTime);
          model.recorder.stop(time);
          // console.log(time, model.context.currentTime, time - model.context.currentTime, (time - model.context.currentTime)*1000);
          setTimeout(function() {
            model.recorder.getBuffer(function(buffers) {
              model.getBufferCallback(buffers, time);
            });
            model.recording = false;
          }, (time - model.context.currentTime) * 1000);
        }
      });
    }
  });
})();
