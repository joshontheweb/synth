(function() {
  'use strict';

  bs.views.LfoView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change:type', this.typeChange);
      this.listenTo(this.model, 'change:frequency', this.frequencyChange);
      this.listenTo(this.model, 'change:gain', this.gainChange);
      this.listenTo(this.model, 'change:maxGain', this.maxGainChange);
    },
    
    template: _.template($('.lfo-template').html()),

    events: {
      'change .type': 'handleTypeInput',
      'change .frequency': 'handleFrequencyInput',
      'change .gain': 'handleGainInput',
      'change .tempo-sync': 'handleTempoSyncInput'
    },

    handleTypeInput: function(e) {
      this.model.set({type: e.target.value});
    },

    handleFrequencyInput: function(e) {
      this.model.set({frequency: e.target.value});
    },

    handleGainInput: function(e) {
      this.model.set({gain: e.target.value});
    },

    handleTempoSyncInput: function(e) {
      if (e.target.checked) {
        this.model.set({frequency: synth.metronome.get('tempo') / 60});
        this.startListeningToTempo();
      } else {
        this.stopListening(synth.metronome);
      }
    },

    typeChange: function(model, type) {
      this.$type.val(type);
    },

    frequencyChange: function(model, frequency) {
      this.$frequency.val(frequency);
    },

    gainChange: function(model, gain) {
      this.$gain[0].value = gain;
    },

    maxGainChange: function(model, maxGain) {
      this.$gain[0].max = maxGain;
    },

    startListeningToTempo: function() {
      var view = this;
      this.listenTo(synth.metronome, 'change:tempo', function(model, tempo) {
        view.model.set({frequency: tempo / 60});
      });
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$patch = this.$('.patch');
      this.$type = this.$('.type');
      this.$frequency = this.$('.frequency');
      this.$gain = this.$('.gain');
      this.$('.type option[value='+ this.model.get('type') +']').attr({selected: true});

      return this;
    }
  });
})();
