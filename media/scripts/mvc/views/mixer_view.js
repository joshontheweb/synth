(function() {
  'use strict';

  bs.views.MixerView = Backbone.View.extend({
    template: _.template($('.mixer-template').html()),
    
    renderGainNodes: function() {
      this.gain1View = new bs.views.GainView({model: this.model.gain1});
      this.gain2View = new bs.views.GainView({model: this.model.gain2});
      this.gain3View = new bs.views.GainView({model: this.model.gain3});
      this.noiseGainView = new bs.views.GainView({model: this.model.noiseGain});

      this.model.gain1Knob = this.gain1View.gainKnob;
      this.model.gain2Knob = this.gain2View.gainKnob;
      this.model.gain3Knob = this.gain3View.gainKnob;
      this.model.gain3Knob = this.noiseGainView.gainKnob;

      this.$('.gain-1').html(this.gain1View.render().el);
      this.$('.gain-2').html(this.gain2View.render().el);
      this.$('.gain-3').html(this.gain3View.render().el);
      this.$('.noise-gain').html(this.noiseGainView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.renderGainNodes();
      return this;
    }
  });
})();
