(function() {
  bs.models.Knob = Backbone.Model.extend({
    defaults: {
      max: 20000,
      min: 0,
      step: 1,
      value: 0,
      decimalPlace: 1,
      startDegree: 0
    }
  });
})();
