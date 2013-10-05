(function() {
  'use strict';

  bs.views.CVPatchView = Backbone.View.extend({
    initialize: function() {
      this.gainKnob = this.model.gainKnob = new bs.models.Knob({
        min: 0,
        max: this.model.destination.maxValue > 20000 ? 20000 : this.model.destination.maxValue,
        value: this.model.get('gain'),
        startDegree: -140
      });
      
      this.listenTo(this.gainKnob, 'change:value', this.handleGainInput);
    },
    
    events: {
      'change .sources': 'handleSourceInput',
      'change .destinations': 'handleDestinationInput'
    },

    tagName: 'li',

    className: 'cv-patch',
    
    template: _.template($('.cv-patch-template').html()),
    
    handleSourceInput: function(e) {
      this.$sources.blur();
      this.model.set({source: e.target.value});
    },

    handleDestinationInput: function(e) {
      this.$destinations.blur();
      this.model.set({destination: e.target.value});
    },
    
    handleGainInput: function(knob, gain) {
      this.model.set({gain: gain});
    },

    renderSources: function() {
      var sourceKey;
      for (sourceKey in this.model.sources) {
        if (this.model.sources.hasOwnProperty(sourceKey)) {
          var source = this.model.sources[sourceKey];
          this.$sources.append('<option value="' + sourceKey + '">' + source.title + '</option>');
        }
      }
    },

    renderDestinations: function() {
      var destKey;
      for (destKey in this.model.destinations) {
        if (this.model.destinations.hasOwnProperty(destKey)) {
          var destination = this.model.destinations[destKey];
          this.$destinations.append('<option value="' + destKey + '">' + destination.title + '</option>');
        }
      }
    },
    
    renderKnob: function() {
      this.gainKnobView = new bs.views.KnobView({model: this.gainKnob});
      this.$gain.html(this.gainKnobView.render().el);
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$sources = this.$('.sources');
      this.$destinations = this.$('.destinations');
      this.$gain = this.$('.gain');

      this.renderSources();
      this.renderDestinations();
      this.renderKnob();

      this.$sources.val(this.model.get('source'));
      this.$destinations.val(this.model.get('destination'));
      
      return this;
    }
  });
})();
