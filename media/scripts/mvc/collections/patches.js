(function() {
  'use strict';

  bs.collections.Patches = Backbone.Collection.extend({
    url: 'http://soundkeep.com/synthpatches',
    model: bs.models.Patch
  });
})();
