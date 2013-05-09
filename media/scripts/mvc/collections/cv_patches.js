(function() {
  'use strict';

  bs.collections.CVPatches = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.patchSources = options.patchSources;
      this.patchDestinations = options.patchDestinations;
    },
    
    model: bs.models.CVPatch
  });
})();
