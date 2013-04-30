(function() {
  // 'use strict';

  bs.views.BufferView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(synth.metronome, 'beat', this.scrollWaveform);
      this.listenTo(this.model, 'change:gain', this.gainChange);
    },
    
    events: {
      'click': 'clear',
    },

    className: 'buffer',
    
    template: _.template($('.buffer-template').html()),

    clear: function(e) {
      this.model.collection.remove(this.model);
      this.model.get('source').stop(0);
      this.model = false;
      this.remove();
    },

    scrollWaveform: function(beat) {
      var width = this.$el.width();
      
      this.$waveform.css({'left': -(((width/this.model.get('beat')) * beat.number))});
    },

    gainChange: function(model, gain) {
      if (!gain) {
        this.$waveform.css({opacity: .5});
        // this.path.attr({stroke: '#eee'});
        // this.path.glow({color: '#eee'});
      } else {
        this.$waveform.css({opacity: 1});
        // this.path.attr({stroke: 'blue'});
        // this.path.glow({color: 'blue'});
      }
    },

    drawWaveform: function() {
      var pcm = this.model.bufferNode.getChannelData(0);
      var width = this.$el.width();
      var height = this.$el.height();
      this.$waveform = this.$('.waveform');

      // get dat paper
      this.paper = Raphael(this.$waveform[0], width, height);

      // clone svg
      // this.$waveform.append(this.$('svg').clone(true));
      
      var x = 0;
      var yCenter = height / 2;

      // start the path string with the cursor at x, yCenter
      var pathString = 'M' + x + ',' + yCenter;

      // adjust the sample rate based on the width of the element
      var inc = Math.round(pcm.length / width);
      
      // sample pcm and build path string
      for (i = 0; i < pcm.length - 1; i += inc) {
        var y = yCenter - Math.round(pcm[i] * 20);
        pathString += 'L'+ x + ',' + y + 'M' + x + ',' + y; 
        x++;
      }

      // feed to path
      this.path = this.paper.path(pathString);

      // for the pretty
      this.path.attr({'stroke': 'blue'});
      this.path.glow({'color': 'blue', 'width': 1, opacity: .3});

      this.$waveform.css({width: width * 4});
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
})();
