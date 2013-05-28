(function() {
  'use strict';

  bs.collections.Patches = Backbone.Collection.extend({
    url: 'http://localhost:1337/synthpatches',
    model: bs.models.Patch
  });
})();
