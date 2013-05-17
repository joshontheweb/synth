(function() {
  'use strict';

  bs.views.MetronomeView = Backbone.View.extend({
    initialize: function(options) {
      this.tempoKnob = this.model.tempoKnob = new bs.models.Knob({min: 20, max: 300, value: this.model.get('tempo'), startDegree: -140});
      
      this.listenTo(this.model, 'change:tempo', this.tempoChange);
      this.listenTo(this.model, 'change:state', this.stateChange);
      this.listenTo(this.model, 'beat', this.beat);

      this.listenTo(this.tempoKnob, 'change:value', this.handleTempoInput);
    },
    
    template: _.template($('.metronome-template').html()),

    events: {
      'change .state': 'handleStateInput',
      'change .tempo': 'handleTempoInput'
    },

    handleStateInput: function(e) {
      this.model.set({'state': e.target.checked});
    },

    handleTempoInput: function(knob, tempo) {
      this.model.set({'tempo': tempo});
    },
    
    tempoChange: function(model, tempo) {
      this.$tempo.val(tempo);
      this.$tempoReading.text(tempo);
    },

    stateChange: function(model, state) {
      this.$state.attr('checked', state)
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

    renderKnobs: function() {
      this.tempoKnobView = new bs.views.KnobView({model: this.tempoKnob});
      this.$tempo.html(this.tempoKnobView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$tempo = this.$('.tempo');
      this.$state = this.$('.state');
      this.$tempoReading = this.$('.tempo-reading');
      this.$beatIndicator = this.$('.beat-indicator');

      this.renderKnobs();
      
      return this;
    }
  });
})();
