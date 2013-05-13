(function() {
  'use strict';

  bs.views.FilterView = Backbone.View.extend({
    initialize: function() {
      this.frequencyKnob = new bs.models.Knob({min: 0, max: 20000, value: 20000, startDegree: -140});
      this.resonanceKnob = new bs.models.Knob({min: 0, max: 40, startDegree: -140});
      
      this.listenTo(this.model, 'change:frequency', this.frequencyChange);
      this.listenTo(this.model, 'change:resonance', this.resonanceChange);

      this.listenTo(this.frequencyKnob, 'change:value', this.handleFrequencyInput);
      this.listenTo(this.resonanceKnob, 'change:value', this.handleResonanceInput);
    },
    
    template: _.template($('.filter-template').html()),

    handleFrequencyInput: function(knob, frequency) {
      this.model.set({frequency: frequency});
    },
    
    handleResonanceInput: function(knob, resonance) {
      this.model.set({resonance: resonance});
    },

    frequencyChange: function(filter, frequency) {
      this.frequencyKnob.set({value: frequency});
      this.$frequencyReading.text(frequency);
    },

    resonanceChange: function(filter, resonance) {
      this.resonanceKnob.set({value: resonance});
      this.$resonanceReading.text(resonance);
    },

    renderKnobs: function() {
      this.frequencyKnobView = new bs.views.KnobView({model: this.frequencyKnob});
      this.resonanceKnobView = new bs.views.KnobView({model: this.resonanceKnob});
      this.$frequency.html(this.frequencyKnobView.render().el);
      this.$resonance.html(this.resonanceKnobView.render().el);
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$frequency = this.$('.frequency');
      this.$frequencyReading = this.$('.frequency-reading');
      this.$resonance = this.$('.resonance');
      this.$resonanceReading = this.$('.resonance-reading');

      this.renderKnobs();
      
      return this;
    }
  });
  
})();
