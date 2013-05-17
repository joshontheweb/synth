(function() {
  'use strict';
  
  bs.models.Loop = Backbone.Model.extend({
      initialize: function(attrs, options) {
        _.bindAll(this);
        
      },

      defaults: {
          duration: 0,
          timestamp: 0,
          user: null,
          waveform: null,
          path: null,
          bpm: null,
          key: null,
          gain: 1,
          muted: false,
          soloMuted: false,
          children: [],
          type: 'loop'
      }
  });

})();
