(function() {
  'use strict';

  bs.models.Filter = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.preNode = this.context.createBiquadFilter();
      this.preNode.type = this.filterMap[attrs.type];
      this.preNode.frequency.value = this.get('frequency');
      this.preNode.frequency.q = this.get('quality');

      
      this.modulationProcessor = this.context.createScriptProcessor(4096);
      this.modulationProcessor.maxValue = 20000;
      this.modulationProcessor.onaudioprocess = _.bind(this.onFreqModProcess, this);

      this.postNode = this.context.createBiquadFilter();
      this.postNode.type = this.filterMap[attrs.type];
      this.postNode.frequency.value = 0;
      this.postNode.frequency.q = this.get('quality');

      this.preNode.connect(this.postNode);
      this.modulationProcessor.connect(this.postNode.frequency);

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

    onFreqModProcess: function(e) {
      // bottom out frequency modulation at filter.frequency == 0 to avoid popping from negative frequency values;
      var input = e.inputBuffer.getChannelData(0);
      var output = e.outputBuffer.getChannelData(0);
      for (var i = 0; i < input.length; i++) {
          output[i] = (input[i] + this.postNode.frequency.value) > 0 ? input[i] : (input[i] - (input[i] + this.postNode.frequency.value)) + .01;
      }
      // console.log(output);
    },

    frequencyChange: function(filter, freq) {
      this.preNode.frequency.value = freq;
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
