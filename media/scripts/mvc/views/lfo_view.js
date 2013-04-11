(function() {
  'use strict';

  bs.views.LfoView = Backbone.View.extend({
    template: _.template($('.lfo-template').html()),

    events: {
      'change .type': 'handleTypeInput',
      'change .frequency': 'handleFrequencyInput'
    },

    handleTypeInput: function(e) {
      this.model.set({type: e.target.value});
    },

    handleFrequencyInput: function(e) {
      this.model.set({frequency: e.target.value});
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$('.type option[value='+ this.model.get('type') +']').attr({selected: true});
      return this;
    }
  });
})();
