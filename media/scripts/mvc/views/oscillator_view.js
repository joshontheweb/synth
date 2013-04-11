(function() {
  'use strict';

  bs.views.OscillatorView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:detune', this.detuneChange);
    },
    
    template: _.template($('.oscillator-template').html()),

    events: {
      'change .type': 'handleTypeInput',
      'change .detune': 'handleDetuneInput'
    },

    handleTypeInput: function(e) {
      this.model.set({type: e.target.value});
    },

    handleDetuneInput: function(e) {
      this.model.set({detune: e.target.value});
    },

    detuneChange: function(oscillator, detune) {
      this.$detuneReading.text(detune);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$('.type option[value='+ this.model.get('type') +']').attr({selected: true});
      this.$detuneReading = this.$('.detune-reading');
      return this;
    }
  });
})();
