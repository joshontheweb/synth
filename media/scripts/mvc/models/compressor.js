(function() {
  'use strict';

  bs.models.Compressor = Backbone.Model.extend({
    initialize: function (attrs, options) {
      this.context = options.context;
      this.compressor = this.context.createDynamicsCompressor();
    },
    
    connect: function(node) {
      this.compressor.connect(node);
    }
  });
})();
