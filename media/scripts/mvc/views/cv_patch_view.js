(function() {
  'use strict';

  bs.views.CVPatchView = Backbone.View.extend({
    events: {
      'change .sources': 'handleSourceInput',
      'change .destinations': 'handleDestinationInput'
    },

    tagName: 'li',
    
    template: _.template($('.cv-patch-template').html()),
    
    handleSourceInput: function(e) {
      this.model.set({source: e.target.value});
    },

    handleDestinationInput: function(e) {
      this.model.set({destination: e.target.value});
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

      this.$sources.val(this.model.get('source'));
      this.$destinations.val(this.model.get('destination'));
      
      return this;
    }
  });
})();
