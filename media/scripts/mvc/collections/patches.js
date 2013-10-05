(function() {
  'use strict';

  bs.collections.Patches = Backbone.Collection.extend({
    // url: 'http://soundkeep.com/synthpatches',
    localStorage: new Backbone.LocalStorage('patches'),
    model: bs.models.Patch
  });
})();
