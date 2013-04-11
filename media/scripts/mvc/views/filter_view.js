(function() {
  'use strict';

  bs.views.FilterView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:frequency', this.frequencyChange);
      this.listenTo(this.model, 'change:resonance', this.resonanceChange);
    },
    
    template: _.template($('.filter-template').html()),

    events: {
      'change .frequency': 'handleFrequencyInput',
      'change .resonance': 'handleResonanceInput'
    },

    handleFrequencyInput: function(e) {
      this.model.set({frequency: e.target.value});
    },
    
    handleResonanceInput: function(e) {
      this.model.set({resonance: e.target.value});
    },

    frequencyChange: function(filter, frequency) {
      this.$frequencyReading.text(frequency);
    },

    resonanceChange: function(filter, resonance) {
      this.$resonanceReading.text(resonance);
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$frequencyReading = this.$('.frequency-reading');
      this.$resonanceReading = this.$('.resonance-reading');
      return this;
    }
  });
  
})();
