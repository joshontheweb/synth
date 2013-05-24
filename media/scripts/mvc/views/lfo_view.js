(function() {
  'use strict';

  bs.views.LfoView = Backbone.View.extend({
    initialize: function() {
      this.frequencyKnob = this.model.frequencyKnob = new bs.models.Knob({min: 0, max: 10, decimalPlace: 10, startDegree: -140});
      this.gainKnob = this.model.gainKnob = new bs.models.Knob({min: 0, max: this.model.get('maxGain'), value: this.model.get('gain'), decimalPlace: 100, startDegree: -140});
      this.waveformKnob = this.model.waveformKnob = new bs.models.TypeKnob({min: 0, max: 280, type: this.model.get('type'), startDegree: -140});
      
      this.listenTo(this.model, 'change:type', this.waveformChange);
      this.listenTo(this.model, 'change:frequency', this.frequencyChange);
      this.listenTo(this.model, 'change:gain', this.gainChange);
      this.listenTo(this.model, 'change:maxGain', this.maxGainChange);
      this.listenTo(this.frequencyKnob, 'change:value', this.handleFrequencyInput);
      this.listenTo(this.gainKnob, 'change:value', this.handleGainInput);
      this.listenTo(this.waveformKnob, 'change:type', this.handleWaveformInput);
    },
    
    template: _.template($('.lfo-template').html()),

    events: {
      'change .tempo-sync': 'handleTempoSyncInput'
    },

    handleWaveformInput: function(knob, waveform) {
      this.model.set({type: waveform});
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

    waveformChange: function(model, waveform) {
      this.waveformKnob.set({'type': waveform});
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
      this.waveformKnobView = new bs.views.TypeKnobView({model: this.waveformKnob, className: 'knob-wrapper waveform-knob-wrapper'});
      this.$frequency.html(this.frequencyKnobView.render().el);
      this.$gain.html(this.gainKnobView.render().el);
      this.$waveform.html(this.waveformKnobView.render().el);

      // this.waveformChange(this.model, this.model.get('type'));
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$waveform = this.$('.waveform');
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
