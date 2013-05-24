(function() {
  'use strict';

  bs.models.Filter = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.preNode = this.context.createBiquadFilter();
      this.preNode.type = this.filterMap[attrs.type];
      this.preNode.frequency.value = this.get('frequency');
      this.preNode.frequency.q = this.get('quality');

      this.postNode = this.context.createBiquadFilter();
      this.postNode.type = this.filterMap[attrs.type];
      this.postNode.frequency.value = this.get('frequency');
      this.postNode.frequency.q = this.get('quality');

      this.preNode.connect(this.postNode);

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
      this.postNode.frequency.value = freq;
    },
    
    resonanceChange: function(filter, resonance) {
      this.preNode.Q.value = resonance;
      this.postNode.Q.value = resonance;
    },

    connect: function(node) {
      this.postNode.connect(node);
    }
    
  });
  
})();
