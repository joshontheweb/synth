(function() {
  'use strict';

  bs.routers.Main = Backbone.Router.extend({
    routes: {
      '': 'patch',
      ':patch': 'patch'
    },
    
    patch: function(patch) {
      var patch = patch ? patch.replace('-', ' ') : null;
      window.synth = new bs.models.Synth({patch: patch});
      window.synthView = new bs.views.SynthView({model: window.synth, el: $('.main')});
      window.synthView.render();
    }
  });
})();
