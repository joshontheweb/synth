(function() {
  'use strict';

  bs.models.Reverb = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.reverb = this.context.createConvolver();
    },

    connect: function(node) {
      this.reverb.connect(node);
    }
  });
})();
