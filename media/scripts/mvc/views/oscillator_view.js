(function() {
  'use strict';

  bs.views.OscillatorView = Backbone.View.extend({
    initialize: function() {
      this.detuneKnob = new bs.models.Knob({min: -1200, max: 1200});

      this.listenTo(this.detuneKnob, 'change:value', this.handleDetuneInput);
      
      this.listenTo(this.model, 'change:type', this.typeChange);
      this.listenTo(this.model, 'change:detune', this.detuneChange);
    },
    
    template: _.template($('.oscillator-template').html()),

    events: {
      'change .type': 'handleTypeInput',
    },

    handleTypeInput: function(e) {
      this.model.set({type: e.target.value});
    },

    handleDetuneInput: function(knob, detune) {
      this.model.set({detune: detune});
    },
    
    typeChange: function(oscillator, type) {
      this.$type.val(type);
    },

    detuneChange: function(oscillator, detune) {
      this.$detuneReading.text(detune);
      this.detuneKnob.set({value: detune});
    },

    renderKnobs: function() {
      this.detuneKnobView = new bs.views.KnobView({model: this.detuneKnob});
      this.$detune.html(this.detuneKnobView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$type = this.$('.type');
      this.$detuneReading = this.$('.detune-reading');
      this.$detune = this.$('.detune');

      this.renderKnobs();
      
      this.$type.val(this.model.get('type'));
      return this;
    }
  });
})();
