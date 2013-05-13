(function() {
  'use strict';

  bs.views.GainView = Backbone.View.extend({
    initialize: function() {
      this.gainKnob = new bs.models.Knob({min: 0, max: 1, startDegree: -140, decimalPlace: 100, value: this.model.get('gain')});
      
      this.listenTo(this.model, 'change:gain', this.gainChange);
      this.listenTo(this.gainKnob, 'change:value', this.handleGainInput);
    },
    
    template: _.template($('.gain-node-template').html()),

    handleGainInput: function(knob, value) {
      this.model.set({gain: value});
    },

    gainChange: function(model, gain) {
      this.gainKnob.set({value: gain});
      this.$gainReading.text(gain);
    },

    renderKnob: function() {
      this.gainKnobView = new bs.views.KnobView({model: this.gainKnob});
      this.$gain.html(this.gainKnobView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$gain = this.$('.gain');
      this.$gainReading = this.$('.gain-reading');

      this.renderKnob();
      
      return this;
    }
  });
})();
