(function() {
  'use strict';
  
  bs.models.Synth = Backbone.Model.extend({
    initialize: function() {
      var synth = this;
      this.context = new webkitAudioContext();
      this.lowpass = new bs.models.Filter({type: 'lowpass', context: this.context});
      this.oscillatorModule = new bs.models.OscillatorModule({context: this.context});
      this.volumeEnvelope = new bs.models.VolumeEnvelope({context: this.context});
      this.filterEnvelope = new bs.models.FilterEnvelope({context: this.context, filter: this.lowpass});
      this.delay = new bs.models.Delay({context: this.context});
      this.lfo = new bs.models.Oscillator({context: this.context, type: 'triangle', frequency: 5});
      this.keyboard = new bs.models.Keyboard();
      this.compressor = new bs.models.Compressor({context: this.context});
      this.metronome = new bs.models.Metronome({context: this.context});
      this.loopModule = new bs.models.LoopModule({context: this.context, metronome: this.metronome});
      this.masterGain = new bs.models.Gain({context: this.context, gain: .5});
      this.gain = new bs.models.Gain({context: this.context});
      this.gain.set({gain: 2000});

      
      this.oscillatorModule.connect(this.volumeEnvelope.gainNode);
      this.volumeEnvelope.connect(this.lowpass.filter);
      this.lowpass.connect(this.filterEnvelope.filter);
      this.filterEnvelope.connect(this.compressor.compressor);
      this.filterEnvelope.connect(this.delay.delayNode);
      this.delay.connect(this.compressor.compressor);
      this.compressor.connect(this.masterGain.gainNode);
      this.metronome.connect(this.masterGain.gainNode);
      this.masterGain.gainNode.connect(this.context.destination);
      this.compressor.connect(this.loopModule.gain);
      
      this.lfo.connect(this.gain.gainNode);
      this.lfo.start(0);
      this.gain.connect(this.lowpass.filter.frequency);
      
      // function getBufferCallback( buffers ) {
      //     var newSource = synth.context.createBufferSource();
      //     var newBuffer = synth.context.createBuffer( 2, buffers[0].length, synth.context.sampleRate );
      //     newBuffer.getChannelData(0).set(buffers[0]);
      //     newBuffer.getChannelData(1).set(buffers[1]);
      //     newSource.buffer = newBuffer;
      // 
      //     newSource.connect( synth.context.destination );
      //     newSource.loop = true;
      //     newSource.start(0);
      // }
      // 
      // this.recorders = [];
      // 
      // $(window).on('keypress', function(e) {
      //   if (e.keyCode == 96) {
      //     if (this.recorder) {
      //       synth.recorders.push(this.recorder);
      //       this.recorder.stop(0);
      //       this.recorder.getBuffer(getBufferCallback);
      //       
      //       // _.each(this.recorders, function(recorder) {
      //       //   recorder.stop();
      //       // }
      //       
      //       this.recorder = false;
      //       return;
      //     }
      // 
      //     this.recorder = new Recorder(synth.compressor.compressor, {workerPath: '/media/scripts/libs/recorder_worker.js'});
      //     this.recorder.record();
      //   }
      // });
  
      // this.delay.connect(this.context.destination);
    }
  });
  
})();
