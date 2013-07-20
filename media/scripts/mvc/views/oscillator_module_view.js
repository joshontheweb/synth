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

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      this.renderOscillators();
      
      return this;
    }
  });
})();
