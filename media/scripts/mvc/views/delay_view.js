(function() {
  'use strict';

  bs.views.DelayView = Backbone.View.extend({
    initialize: function() {
      this.timeKnob = new bs.models.Knob({min: 0, max: 1, value: this.model.get('time'), decimalPlace: 100, startDegree: -140});
      this.gainKnob = new bs.models.Knob({min: 0, max: 1, value: this.model.get('gain'), decimalPlace: 100, startDegree: -140});

      this.listenTo(this.model, 'change:time', this.timeChange);
      this.listenTo(this.model, 'change:gain', this.gainChange);
      this.listenTo(this.timeKnob, 'change:value', this.handleTimeInput);
      this.listenTo(this.gainKnob, 'change:value', this.handleGainInput);
    },

    template: _.template($('.delay-template').html()),

    handleTimeInput: function(knob, time) {
      this.model.set({time: time});
    },

    handleGainInput: function(knob, gain) {
      this.model.set({gain: gain});
    },

    timeChange: function(delay, time) {
      this.timeKnob.set({value: time});
      this.$timeReading.text(time);
    },

    gainChange: function(delay, gain) {
      this.gainKnob.set({value: gain});
      this.$gainReading.text(gain);
    },

    renderKnobs: function() {
      this.timeKnobView = new bs.views.KnobView({model: this.timeKnob});
      this.$time.html(this.timeKnobView.render().el);
      this.gainKnobView = new bs.views.KnobView({model: this.gainKnob});
      this.$gain.html(this.gainKnobView.render().el);
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$time = this.$('.time');
      this.$timeReading = this.$('.time-reading');
      this.$gain = this.$('.gain');
      this.$gainReading = this.$('.gain-reading');

      this.renderKnobs();
      
      return this;
    }
  });
})();
