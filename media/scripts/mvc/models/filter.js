(function() {
  'use strict';

  bs.models.Filter = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.node = this.context.createBiquadFilter();
      this.node.type = this.filterMap[attrs.type];
      this.node.frequency.value = this.get('frequency');
      this.node.frequency.q = this.get('quality');

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
      this.node.frequency.value = freq;
    },
    
    resonanceChange: function(filter, resonance) {
      this.node.Q.value = resonance;
    },

    connect: function(node) {
      this.node.connect(node);
    }
    
  });
  
})();
