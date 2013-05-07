(function() {
  'use strict';

  bs.models.OscillatorModule = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      
      this.osc1 = new bs.models.Oscillator({type: 'sawtooth'}, {context: this.context});
      this.osc2 = new bs.models.Oscillator({type: 'sine'}, {context: this.context});
      this.osc3 = new bs.models.Oscillator({type: 'triangle'}, {context: this.context});

      this.gain1 = new bs.models.Gain({gain: this.get('gain')}, {context: this.context});
      this.gain2 = new bs.models.Gain({gain: this.get('gain')}, {context: this.context});
      this.gain3 = new bs.models.Gain({gain: this.get('gain')}, {context: this.context});

      this.gate = new bs.models.Gain({}, {context: this.context});

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
      this.on('change:osc1', this.setOsc1);
      this.on('change:osc2', this.setOsc2);
      this.on('change:osc3', this.setOsc3);
      this.on('change:gain1', this.setGain1);
      this.on('change:gain2', this.setGain2);
      this.on('change:gain3', this.setGain3);

      this.listenTo(this.osc1, 'change', this.syncWithOsc1);
      this.listenTo(this.osc2, 'change', this.syncWithOsc2);
      this.listenTo(this.osc3, 'change', this.syncWithOsc3);
      this.listenTo(this.gain1, 'change', this.syncWithGain1);
      this.listenTo(this.gain2, 'change', this.syncWithGain2);
      this.listenTo(this.gain3, 'change', this.syncWithGain3);
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

    setOsc1: function(model, attrs) {
      this.osc1.set(attrs);
    },

    syncWithOsc1: function(model) {
      this.set({'osc1': model.changed});
    },

    setOsc2: function(model, attrs) {
      this.osc2.set(attrs);
    },

    syncWithOsc2: function(model) {
      this.set({'osc2': model.changed});
    },

    setOsc3: function(model, attrs) {
      this.osc3.set(attrs);
    },

    syncWithOsc3: function(model) {
      this.set({'osc3': model.changed});
    },

    setGain1: function(model, attrs) {
      this.gain1.set(attrs);
    },

    syncWithGain1: function(model) {
      this.set({'gain1': model.changed});
    },

    setGain2: function(model, attrs) {
      this.gain2.set(attrs);
    },

    syncWithGain2: function(model) {
      this.set({'gain2': model.changed});
    },

    setGain3: function(model, attrs) {
      this.gain3.set(attrs);
    },

    syncWithGain3: function(model) {
      this.set({'gain3': model.changed});
    },

    connect: function(model) {
      this.gate.connect(model);
    },

    toJSON: function() {
      this.set({'osc1': this.osc1.toJSON()});
      this.set({'osc2': this.osc2.toJSON()});
      this.set({'osc3': this.osc3.toJSON()});
      this.set({'gain1': this.gain1.toJSON()});
      this.set({'gain2': this.gain2.toJSON()});
      this.set({'gain3': this.gain3.toJSON()});
      return this.attributes;
    }

  });
})();
