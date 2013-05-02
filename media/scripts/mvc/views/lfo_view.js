(function() {
  'use strict';

  bs.views.LfoView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:gain', this.gainChange);
      this.listenTo(this.model, 'change:maxGain', this.maxGainChange);
    },
    
    template: _.template($('.lfo-template').html()),

    events: {
      'change .type': 'handleTypeInput',
      'change .frequency': 'handleFrequencyInput',
      'change .gain': 'handleGainInput',
    },

    handleTypeInput: function(e) {
      this.model.set({type: e.target.value});
    },

    handleFrequencyInput: function(e) {
      this.model.set({frequency: e.target.value});
    },

    handleGainInput: function(e) {
      this.model.set({gain: e.target.value});
    },

    gainChange: function(model, gain) {
      this.$gain[0].value = gain;
    },

    maxGainChange: function(model, maxGain) {
      this.$gain[0].max = maxGain;
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$patch = this.$('.patch');
      this.$gain = this.$('.gain');
      this.$('.type option[value='+ this.model.get('type') +']').attr({selected: true});

      return this;
    }
  });
})();
