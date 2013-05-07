(function() {
  'use strict';

  bs.views.EnvelopeView = Backbone.View.extend({
    initialize: function(attrs) {
      this.template = attrs.template || this.template;
      this.listenTo(this.model, 'change:frequency', this.frequencyChange);

      this.listenTo(this.model, 'change:attack', this.attackChange);
      this.listenTo(this.model, 'change:decay', this.decayChange);
      this.listenTo(this.model, 'change:sustain', this.sustainChange);
      this.listenTo(this.model, 'change:release', this.releaseChange);
    },
    
    template: _.template($('.envelope-template').html()),

    events: {
      'change .attack': 'handleAttackInput',
      'change .decay': 'handleDecayInput',
      'change .sustain': 'handleSustainInput',
      'change .release': 'handleReleaseInput'
    },

    handleAttackInput: function(e) {
      this.model.set({'attack': parseFloat(e.target.value)});
    },

    handleDecayInput: function(e) {
      this.model.set({'decay': parseFloat(e.target.value)});
    },

    handleSustainInput: function(e) {
      this.model.set({'sustain': parseFloat(e.target.value)});
    },

    handleReleaseInput: function(e) {
      this.model.set({'release': parseFloat(e.target.value)});
    },

    attackChange: function(envelope, attack) {
      this.$attack.val(attack);
      this.$attackReading.text(attack);
    },

    decayChange: function(envelope, decay) {
      this.$decay.val(decay);
      this.$decayReading.text(decay);
    },

    sustainChange: function(envelope, sustain) {
      this.$sustain.val(sustain);
      this.$sustainReading.text(sustain);
    },

    releaseChange: function(envelope, release) {
      this.$release.val(release);
      this.$releaseReading.text(release);
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$attack = this.$('.attack');
      this.$attackReading = this.$('.attack-reading');
      this.$decay = this.$('.decay');
      this.$decayReading = this.$('.decay-reading');
      this.$sustain = this.$('.sustain');
      this.$sustainReading = this.$('.sustain-reading');
      this.$release = this.$('.release');
      this.$releaseReading = this.$('.release-reading');
      return this;
    }
  });
  
})();
