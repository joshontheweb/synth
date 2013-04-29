(function() {
  'use strict';

  bs.views.SynthView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model.keyboard, 'keyDown', this.handleKeyDown);
      this.listenTo(this.model.keyboard, 'keyUp', this.handleKeyUp);
    },
    
    template: _.template($('.synth-template').html()),

    handleKeyDown: function(note, freq) {
      this.model.oscillatorModule.set({frequency: freq});
      this.model.volumeEnvelope.triggerAttack();
      this.model.filterEnvelope.triggerAttack();
    },
    
    handleKeyUp: function(note, freq) {
      if (!this.model.keyboard.pressed) {
        this.model.volumeEnvelope.triggerRelease();
        this.model.filterEnvelope.triggerRelease();
      }
    },

    renderLowpass: function() {
      this.lowpassView = new bs.views.FilterView({model: this.model.lowpass});
      this.$('.low-pass').append(this.lowpassView.render().el);
    },

    renderOscillatorModule: function() {
      this.oscillatorView = new bs.views.OscillatorModuleView({model: this.model.oscillatorModule});
      this.$('.oscillator-module').append(this.oscillatorView.render().el);
    },

    renderKeyboard: function() {
      this.keyboardView = new bs.views.KeyboardView({model: this.model.keyboard});
      this.$el.append(this.keyboardView.render().el);
    },

    renderOscilloscope: function() {
      this.oscilloscope = new WavyJones(this.model.context, 'oscilloscope');
      this.model.compressor.connect(this.oscilloscope);
    },

    renderVolumeEnvelope: function() {
      this.envelopeView = new bs.views.EnvelopeView({model: this.model.volumeEnvelope});
      this.$('.volume-envelope').append(this.envelopeView.render().el);
    },

    renderFilterEnvelope: function() {
      this.envelopeView = new bs.views.EnvelopeView({model: this.model.filterEnvelope, template: _.template($('.filter-envelope-template').html())});
      this.$('.filter-envelope').append(this.envelopeView.render().el);
    },

    renderDelay: function() {
      this.delayView = new bs.views.DelayView({model: this.model.delay});
      this.$('.delay').append(this.delayView.render().el);
    },

    renderLfo: function() {
      this.oscillatorView = new bs.views.LfoView({model: this.model.lfo});
      this.$('.lfo').append(this.oscillatorView.render().el);
    },

    renderLoopModule: function() {
      this.loopModuleView = new bs.views.LoopModuleView({model: this.model.loopModule});
      this.$('.loop-module').append(this.loopModuleView.render().el);
    },

    renderMetronome: function() {
      this.metronomeView = new bs.views.MetronomeView({model: this.model.metronome});
      this.$('.metronome').html(this.metronomeView.render().el);
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      this.renderLowpass();
      this.renderOscillatorModule();
      this.renderKeyboard();
      this.renderOscilloscope();
      this.renderVolumeEnvelope();
      this.renderFilterEnvelope();
      this.renderDelay();
      this.renderLfo();
      this.renderLoopModule();
      this.renderMetronome();
      
      return this;
    }
  });
})();
