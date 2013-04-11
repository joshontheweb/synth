(function() {
  'use strict';

  bs.models.OscillatorModule = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      
      this.osc1 = new bs.models.Oscillator({type: 'sawtooth', context: this.context});
      this.osc2 = new bs.models.Oscillator({type: 'sine', context: this.context});
      this.osc3 = new bs.models.Oscillator({type: 'triangle', context: this.context});

      this.gain1 = new bs.models.Gain({context: this.context});
      this.gain2 = new bs.models.Gain({context: this.context});
      this.gain3 = new bs.models.Gain({context: this.context});

      this.gate = new bs.models.Gain({context: this.context});

      this.osc1.connect(this.gain1.gainNode);
      this.osc2.connect(this.gain2.gainNode);
      this.osc3.connect(this.gain3.gainNode);

      this.gain1.connect(this.gate.gainNode);
      this.gain2.connect(this.gate.gainNode);
      this.gain3.connect(this.gate.gainNode);
      
      this.osc1.start(0);
      this.osc2.start(0);
      this.osc3.start(0);

      this.on('change:frequency', this.frequencyChange);
    },

    defaults: {
      frequency: 440,
      gain: 1
    },

    frequencyChange: function(model, freq) {
      this.osc1.set({frequency: freq});
      this.osc2.set({frequency: freq});
      this.osc3.set({frequency: freq});
    },

    connect: function(node) {
      this.gate.connect(node);
    }

  });
})();
