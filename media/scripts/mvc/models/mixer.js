(function() {
  'use strict';

  bs.models.Mixer = Backbone.Model.extend({
    initialize: function(attrs, options) {
      this.context = options.context;
      this.gain1 = new bs.models.Gain({gain: this.get('gain')}, {context: this.context});
      this.gain2 = new bs.models.Gain({gain: this.get('gain')}, {context: this.context});
      this.gain3 = new bs.models.Gain({gain: this.get('gain')}, {context: this.context});

      this.gate = new bs.models.Gain({}, {context: this.context});

      this.gain1.connect(this.gate.node);
      this.gain2.connect(this.gate.node);
      this.gain3.connect(this.gate.node);
      
      this.on('change:gain1', this.setGain1);
      this.on('change:gain2', this.setGain2);
      this.on('change:gain3', this.setGain3);
      
      this.listenTo(this.gain1, 'change', this.syncWithGain1);
      this.listenTo(this.gain2, 'change', this.syncWithGain2);
      this.listenTo(this.gain3, 'change', this.syncWithGain3);
    },
  
    defaults: {
      gain: .5
    },
    
    setGain1: function(model, attrs) {
      this.gain1.set(attrs);
    },

    syncWithGain1: function(model) {
      this.set({'gain1': model.changed});
    },

    setGain2: function(model, attrs) {
      this.gain2.set(attrs);
    },

    syncWithGain2: function(model) {
      this.set({'gain2': model.changed});
    },

    setGain3: function(model, attrs) {
      this.gain3.set(attrs);
    },

    syncWithGain3: function(model) {
      this.set({'gain3': model.changed});
    },

    connect: function(node) {
      this.gate.node.connect(node);
    },

    toJSON: function() {
      this.set({'gain1': this.gain1.toJSON()});
      this.set({'gain2': this.gain2.toJSON()});
      this.set({'gain3': this.gain3.toJSON()});
      return this.attributes;
    }
    
  });
})();
