(function() {
  'use strict';

  bs.models.CVPatchModule = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      
      var cvPatches = attrs.cvPatches || [];
      
      this.cvPatches = new bs.collections.CVPatches(cvPatches, {patchSources: options.patchSources, patchDestinations: options.patchDestinations});
      this.cvPatches.add([{outputIndex: 1}]);
      
      this.on('change:cvPatches', this.cvPatchesChange);
    },

    cvPatchesChange: function(model, cvPatches) {
      this.cvPatches.reset(cvPatches);
    },

    toJSON: function() {
      this.set({cvPatches: this.cvPatches.toJSON()});
      return this.attributes;
    }
  });
})();
