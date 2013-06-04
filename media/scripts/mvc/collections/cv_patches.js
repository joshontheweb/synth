(function() {
  'use strict';

  bs.collections.CVPatches = Backbone.Collection.extend({
    initialize: function(models, options) {
      this.context = options.context;
      this.patchSources = options.patchSources;
      this.patchDestinations = options.patchDestinations;
    },
    
    model: bs.models.CVPatch
  });
})();
