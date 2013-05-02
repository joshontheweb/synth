(function() {
  'use strict';

  bs.views.PatchView = Backbone.View.extend({
    events: {
      'change .sources': 'handleSourceInput',
      'change .destinations': 'handleDestinationInput'
    },
    
    template: _.template($('.patch-template').html()),
    
    handleSourceInput: function(e) {
      this.model.set({source: this.model.sources[e.target.value]});
    },

    handleDestinationInput: function(e) {
      this.model.set({destination: this.model.destinations[e.target.value]});
    },

    renderSources: function() {
      var sourceKey;
      for (sourceKey in this.model.sources) {
        if (this.model.sources.hasOwnProperty(sourceKey)) {
          this.$sources.append('<option value="' + sourceKey + '">' + sourceKey + '</option>');
        }
      }
    },

    renderDestinations: function() {
      var destKey;
      for (destKey in this.model.destinations) {
        if (this.model.destinations.hasOwnProperty(destKey)) {
          this.$destinations.append('<option value="' + destKey + '">' + destKey + '</option>');
        }
      }
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$sources = this.$('.sources');
      this.$destinations = this.$('.destinations');

      this.renderSources();
      this.renderDestinations();

      return this;
    }
  });
})();
