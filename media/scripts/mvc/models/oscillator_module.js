(function() {
  'use strict';

  bs.models.OscillatorModule = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      
      this.osc1 = new bs.models.Oscillator({type: 'sawtooth'}, {context: this.context});
      this.osc2 = new bs.models.Oscillator({type: 'sine'}, {context: this.context});
      this.osc3 = new bs.models.Oscillator({type: 'triangle'}, {context: this.context});

      this.osc1.start(0);
      this.osc2.start(0);
      this.osc3.start(0);

      this.on('change:osc1', this.setOsc1);
      this.on('change:osc2', this.setOsc2);
      this.on('change:osc3', this.setOsc3);
      this.on('change:frequency', this.frequencyChange);

      this.listenTo(this.osc1, 'change', this.syncWithOsc1);
      this.listenTo(this.osc2, 'change', this.syncWithOsc2);
      this.listenTo(this.osc3, 'change', this.syncWithOsc3);
    },

    defaults: {
      frequency: 440,
    },

    frequencyChange: function(model, freq) {
      this.osc1.set({frequency: freq});
      this.osc2.set({frequency: freq});
      this.osc3.set({frequency: freq});
    },

    setOsc1: function(model, attrs) {
      this.osc1.set(attrs);
    },

    syncWithOsc1: function(model) {
      this.set({'osc1': _.extend(this.get('osc1'), model.changed)});
    },

    setOsc2: function(model, attrs) {
      this.osc2.set(attrs);
    },

    syncWithOsc2: function(model) {
      this.set({'osc2': _.extend(this.get('osc2'), model.changed)});
    },

    setOsc3: function(model, attrs) {
      this.osc3.set(attrs);
    },

    syncWithOsc3: function(model) {
      this.set({'osc3': _.extend(this.get('osc3'), model.changed)});
    },

    connect: function(node) {
      this.osc1.connect(node.gain1.node);
      this.osc2.connect(node.gain2.node);
      this.osc3.connect(node.gain3.node);
    },

    toJSON: function() {
      this.set({'osc1': this.osc1.toJSON()});
      this.set({'osc2': this.osc2.toJSON()});
      this.set({'osc3': this.osc3.toJSON()});
      return this.attributes;
    }

  });
})();
