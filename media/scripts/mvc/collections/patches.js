(function() {
  'use strict';

  bs.collections.Patches = Backbone.Collection.extend({
    localStorage: new Backbone.LocalStorage("patches"),
    model: bs.models.Patch
  });
})();
