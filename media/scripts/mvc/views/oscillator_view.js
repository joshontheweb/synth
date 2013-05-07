(function() {
  'use strict';

  bs.views.OscillatorView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:type', this.typeChange);
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
    
    typeChange: function(oscillator, type) {
      this.$type.val(type);
    },

    detuneChange: function(oscillator, detune) {
      this.$detuneReading.text(detune);
      this.$detune.val(detune);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$type = this.$('.type');
      this.$detuneReading = this.$('.detune-reading');
      this.$detune = this.$('.detune');
      this.$type.val(this.model.get('type'))
      return this;
    }
  });
})();
