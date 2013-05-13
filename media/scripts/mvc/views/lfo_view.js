(function() {
  'use strict';

  bs.views.LfoView = Backbone.View.extend({
    initialize: function() {
      this.frequencyKnob = new bs.models.Knob({min: 0, max: 40, startDegree: -140});
      this.gainKnob = new bs.models.Knob({min: 0, max: this.model.get('maxGain'), value: this.model.get('gain'), decimalPlace: 100, startDegree: -140});
      
      this.listenTo(this.model, 'change:type', this.typeChange);
      this.listenTo(this.model, 'change:frequency', this.frequencyChange);
      this.listenTo(this.model, 'change:gain', this.gainChange);
      this.listenTo(this.model, 'change:maxGain', this.maxGainChange);
      this.listenTo(this.frequencyKnob, 'change:value', this.handleFrequencyInput);
      this.listenTo(this.gainKnob, 'change:value', this.handleGainInput);
    },
    
    template: _.template($('.lfo-template').html()),

    events: {
      'change .type': 'handleTypeInput',
      'change .tempo-sync': 'handleTempoSyncInput'
    },

    handleTypeInput: function(e) {
      this.model.set({type: e.target.value});
    },

    handleFrequencyInput: function(knob, frequency) {
      this.model.set({frequency: frequency});
    },

    handleGainInput: function(knob, gain) {
      this.model.set({gain: gain});
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
      this.frequencyKnob.set({value: frequency});
      this.$frequencyReading.text(frequency);
    },

    gainChange: function(model, gain) {
      this.gainKnob.set({value: gain});
      this.$gainReading.text(gain);
    },

    maxGainChange: function(model, maxGain) {
      this.gainKnob.set({'max': maxGain});
      this.$gain[0].max = maxGain;
    },

    startListeningToTempo: function() {
      var view = this;
      this.listenTo(synth.metronome, 'change:tempo', function(model, tempo) {
        view.model.set({frequency: tempo / 60});
      });
    },

    renderKnobs: function() {
      this.frequencyKnobView = new bs.views.KnobView({model: this.frequencyKnob});
      this.gainKnobView = new bs.views.KnobView({model: this.gainKnob});
      this.$frequency.html(this.frequencyKnobView.render().el);
      this.$gain.html(this.gainKnobView.render().el);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$type = this.$('.type');
      this.$frequency = this.$('.frequency');
      this.$frequencyReading = this.$('.frequency-reading');
      this.$gain = this.$('.gain');
      this.$gainReading = this.$('.gain-reading');
      this.$('.type option[value='+ this.model.get('type') +']').attr({selected: true});

      this.renderKnobs();

      return this;
    }
  });
})();
