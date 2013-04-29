(function() {
  'use strict';

  bs.views.MetronomeView = Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.model, 'change:tempo', this.tempoChange);
    },
    
    template: _.template($('.metronome-template').html()),

    events: {
      'change .state': 'handleStateInput',
      'change .tempo': 'handleTempoInput'
    },

    handleStateInput: function(e) {
      this.model.set({'state': e.target.checked});
    },

    handleTempoInput: function(e) {
      this.model.set({'tempo': e.target.value});
    },
    
    tempoChange: function(model, tempo) {
      this.$tempoReading.text(tempo);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$tempoReading = this.$('.tempo-reading');
      return this;
    }
  });
})();
