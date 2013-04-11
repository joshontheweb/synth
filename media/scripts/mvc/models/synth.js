(function() {
  'use strict';
  
  bs.models.Synth = Backbone.Model.extend({
    initialize: function() {
      this.context = new webkitAudioContext();
      this.lowpass = new bs.models.Filter({type: 'lowpass', context: this.context});
      this.oscillatorModule = new bs.models.OscillatorModule({context: this.context});
      this.volumeEnvelope = new bs.models.VolumeEnvelope({context: this.context});
      this.filterEnvelope = new bs.models.FilterEnvelope({context: this.context, filter: this.lowpass});
      this.delay = new bs.models.Delay({context: this.context});
      this.lfo = new bs.models.Oscillator({context: this.context, type: 'sine', frequency: 5});
      this.keyboard = new bs.models.Keyboard();
      this.compressor = new bs.models.Compressor({context: this.context});
      this.gain = new bs.models.Gain({context: this.context});
      this.gain.set({gain: 300});
      
      this.oscillatorModule.connect(this.volumeEnvelope.gainNode);
      this.volumeEnvelope.connect(this.lowpass.filter);
      this.lowpass.connect(this.filterEnvelope.filter);
      this.filterEnvelope.connect(this.compressor.compressor);
      this.filterEnvelope.connect(this.delay.delayNode);
      this.delay.connect(this.compressor.compressor);
      this.compressor.connect(this.context.destination);

      
      this.lfo.connect(this.gain.gainNode);
      this.lfo.start(0);
      this.gain.connect(this.lowpass.filter.frequency);
      
      // this.delay.connect(this.context.destination);
    }
  });
  
})();
