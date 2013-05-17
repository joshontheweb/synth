(function() {
  'use strict';

  bs.views.OscillatorView = Backbone.View.extend({
    initialize: function() {
      this.waveformKnob = this.model.waveformKnob = new bs.models.TypeKnob({min: 0, max: 280, type: this.model.get('type'), startDegree: -140});
      this.detuneKnob = this.model.detuneKnob = new bs.models.Knob({min: -1200, max: 1200});

      this.listenTo(this.detuneKnob, 'change:value', this.handleDetuneInput);
      this.listenTo(this.waveformKnob, 'change:type', this.handleWaveformInput);
      
      this.listenTo(this.model, 'change:type', this.waveformChange);
      this.listenTo(this.model, 'change:detune', this.detuneChange);
    },
    
    template: _.template($('.oscillator-template').html()),

    events: {
      'change .type': 'handleTypeInput',
    },

    handleWaveformInput: function(knob, waveform) {
      this.model.set({type: waveform});
    },

    handleDetuneInput: function(knob, detune) {
      this.model.set({detune: detune});
    },
    
    waveformChange: function(oscillator, waveform) {
      this.waveformKnob.set({type: waveform})
    },

    detuneChange: function(oscillator, detune) {
      this.$detuneReading.text(detune);
      this.detuneKnob.set({value: detune});
    },

    renderKnobs: function() {
      this.waveformKnobView = new bs.views.TypeKnobView({model: this.waveformKnob, className: 'knob-wrapper waveform-knob-wrapper'});
      this.detuneKnobView = new bs.views.KnobView({model: this.detuneKnob});
      this.$waveform.html(this.waveformKnobView.render().el);
      this.$detune.html(this.detuneKnobView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$waveform = this.$('.waveform');
      this.$detuneReading = this.$('.detune-reading');
      this.$detune = this.$('.detune');

      this.renderKnobs();
      
      return this;
    }
  });
})();
