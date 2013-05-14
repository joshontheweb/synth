(function() {
  'use strict';

  bs.models.TypeKnob = Backbone.Model.extend({
    initialize: function() {
    },

    defaults: {
      types: ['sine', 'triangle', 'square', 'sawtooth'],
      type: 'sawtooth',
      max: 20000,
      min: 0,
      step: 1,
      value: 0,
      decimalPlace: 1,
      startDegree: 0
    }
  });
})();
