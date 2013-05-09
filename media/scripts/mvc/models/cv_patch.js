(function() {
  'use strict';

  bs.models.CVPatch = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.sources = this.collection.patchSources;
      this.destinations = this.collection.patchDestinations;

      this.on('change:source', this.sourceChange);
      this.on('change:destination', this.destinationChange);

      this.setDestination(this.get('destination'));
    },

    defaults: {
      'destination': 'filter',
      'source': 'lfo',
      'outputIndex': 1
    },
    
    sourceChange: function(model, source) {
      var prevSource = this.previousAttributes().source;
      if (prevSource) {
        this.sources[prevSource].disconnect();
        this.setSource(source);
      }
    },

    destinationChange: function(model, destination) {
      this.setDestination(destination);
    },

    setDestination: function(destination) {
      var source = this.sources[this.get('source')];
      var destination = this.destinations[destination];
      var index = this.get('outputIndex');
      
      source.disconnect(index);
      source.set({'maxGain': destination.maxValue});
      source.connect(destination, index);
    }
    
  });
})();
