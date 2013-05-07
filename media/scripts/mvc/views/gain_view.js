(function() {
  'use strict';

  bs.views.GainView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:gain', this.gainChange)
    },
    
    template: _.template($('.gain-node-template').html()),

    events: {
      'change .gain': 'handleGainInput'
    },

    handleGainInput: function(e) {
      this.model.set({gain: e.target.value});
    },

    gainChange: function(model, gain) {
      this.$gain.val(gain);
      this.$gainReading.text(gain);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$gain = this.$('.gain');
      this.$gainReading = this.$('.gain-reading');
      return this;
    }
  });
})();
