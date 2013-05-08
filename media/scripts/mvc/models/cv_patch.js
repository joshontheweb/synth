(function() {
  'use strict';

  bs.models.CVPatch = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.sources = this.get('sources');
      this.destinations = this.get('destinations');

      this.on('change:source', this.sourceChange);
      this.on('change:destination', this.destinationChange);

      this.set({'source': this.sources.lfo});
      this.set({'destination': this.destinations.filter});
    },

    defaults: {
      'sources': [],
      'destinations': [],
      'destination': null,
      'source': null,
      'outputIndex': 0
    },

    sourceChange: function(model, source) {
      var prevSource = this.previousAttributes().source;
      if (prevSource) {
        prevSource.disconnect();
      }
    },

    destinationChange: function(model, destination) {
      var source = this.get('source');
      source.disconnect(this.get('outputIndex'));
      source.set({'maxGain': destination.maxValue});
      source.connect(destination, this.get('outputIndex'));
    }
    
  });
})();
