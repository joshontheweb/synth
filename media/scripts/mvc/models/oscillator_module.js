(function() {
  'use strict';

  bs.models.OscillatorModule = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      
      this.osc1 = new bs.models.Oscillator({type: 'sawtooth', context: this.context});
      this.osc2 = new bs.models.Oscillator({type: 'sine', context: this.context});
      this.osc3 = new bs.models.Oscillator({type: 'triangle', context: this.context});

      this.gain1 = new bs.models.Gain({context: this.context, gain: this.get('gain')});
      this.gain2 = new bs.models.Gain({context: this.context, gain: this.get('gain')});
      this.gain3 = new bs.models.Gain({context: this.context, gain: this.get('gain')});

      this.gate = new bs.models.Gain({context: this.context});

      this.osc1.connect(this.gain1.node);
      this.osc2.connect(this.gain2.node);
      this.osc3.connect(this.gain3.node);

      this.gain1.connect(this.gate.node);
      this.gain2.connect(this.gate.node);
      this.gain3.connect(this.gate.node);
      
      this.osc1.start(0);
      this.osc2.start(0);
      this.osc3.start(0);

      this.on('change:frequency', this.frequencyChange);
    },

    defaults: {
      frequency: 440,
      gain: .5
    },

    frequencyChange: function(model, freq) {
      this.osc1.set({frequency: freq});
      this.osc2.set({frequency: freq});
      this.osc3.set({frequency: freq});
    },

    connect: function(model) {
      this.gate.connect(model);
    }

  });
})();
