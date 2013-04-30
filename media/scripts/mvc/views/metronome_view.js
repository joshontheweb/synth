(function() {
  'use strict';

  bs.views.MetronomeView = Backbone.View.extend({
    initialize: function(options) {
      this.listenTo(this.model, 'change:tempo', this.tempoChange);
      this.listenTo(this.model, 'beat', this.beat);
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

    beat: function(beat) {
      if (beat.number % 16 === 0) {
        this.$beatIndicator.css({'background-color': 'red'});
      } else if (beat.number % 4 === 0) {
        this.$beatIndicator.css({'background-color': 'maroon'});
      } else {
        this.$beatIndicator.css({'background-color': 'black'});
      }
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$tempoReading = this.$('.tempo-reading');
      this.$beatIndicator = this.$('.beat-indicator');
      return this;
    }
  });
})();
