(function() {
  Backbone.emulateHTTP = true;
  Backbone.emulateJSON = true;
  Backbone.Model.prototype.idAttribute = '_id';

  bs = { // Backbone Synth
    models: {},
    views: {},
    collections: {},
    routers: {}
  }
})();
