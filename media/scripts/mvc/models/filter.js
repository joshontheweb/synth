(function() {
  'use strict';

  bs.models.Filter = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.filter = this.context.createBiquadFilter();
      this.filter.type = this.filterMap[attrs.type];
      this.filter.frequency.value = this.get('frequency');
      this.filter.frequency.q = this.get('quality');

      this.on('change:frequency', this.frequencyChange);
      this.on('change:resonance', this.resonanceChange);
    },

    filterMap: {
      'lowpass': 0
    },
    
    defaults: {
      min: 20,
      max: 20000,
      frequency: 20000,
      resonance: 1
    },

    frequencyChange: function(filter, freq) {
      this.filter.frequency.value = freq;
    },
    
    resonanceChange: function(filter, resonance) {
      this.filter.Q.value = resonance;
    },

    connect: function(node) {
      this.filter.connect(node);
    }
    
  });
  
})();
