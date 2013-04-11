(function() {
  'use strict';

  bs.views.DelayView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:time', this.timeChange);
    },

    template: _.template($('.delay-template').html()),

    events: {
      'change .time': 'handleTimeInput'
    },

    handleTimeInput: function(e) {
      this.model.set({time: e.target.value});
    },

    timeChange: function(delay, time) {
      this.model.delayNode.delayTime.value = time;
      this.$timeReading.text(time);
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$timeReading = this.$('.time-reading');
      return this;
    }
  });
})();
