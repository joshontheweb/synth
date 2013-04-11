(function() {
  'use strict';

  bs.views.GainView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:gain', this.updateGainReading)
    },
    
    template: _.template($('.gain-node-template').html()),

    events: {
      'change .gain': 'gainChange'
    },

    gainChange: function(e) {
      this.model.set({gain: e.target.value});
    },

    updateGainReading: function(model, gain) {
      this.$gainReading.text(gain);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$gainReading = this.$('.gain-reading');
      return this;
    }
  });
})();
