(function() {
  'use strict';

  bs.views.OscillatorModuleView = Backbone.View.extend({
    initialize: function() {
      
    },
    
    template: _.template($('.oscillator-module-template').html()),

    renderOscillators: function() {
      this.osc1View = new bs.views.OscillatorView({model: this.model.osc1});
      this.osc2View = new bs.views.OscillatorView({model: this.model.osc2});
      this.osc3View = new bs.views.OscillatorView({model: this.model.osc3});

      this.$('.osc-1').html(this.osc1View.render().el);
      this.$('.osc-2').html(this.osc2View.render().el);
      this.$('.osc-3').html(this.osc3View.render().el);
    },

    renderGainNodes: function() {
      this.gain1View = new bs.views.GainView({model: this.model.gain1});
      this.gain2View = new bs.views.GainView({model: this.model.gain2});
      this.gain3View = new bs.views.GainView({model: this.model.gain3});

      this.model.gain1Knob = this.gain1View.gainKnob;
      this.model.gain2Knob = this.gain2View.gainKnob;
      this.model.gain3Knob = this.gain3View.gainKnob;

      this.$('.gain-1').html(this.gain1View.render().el);
      this.$('.gain-2').html(this.gain2View.render().el);
      this.$('.gain-3').html(this.gain3View.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      this.renderOscillators();
      this.renderGainNodes();
      
      return this;
    }
  });
})();
