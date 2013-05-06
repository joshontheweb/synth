(function() {
  // 'use strict';

  bs.views.BufferView = Backbone.View.extend({
    initialize: function() {
      // this.listenTo(synth.metronome, 'beat', this.scrollWaveform);
      this.listenTo(this.model, 'change:gain', this.gainChange);
      this.listenTo(this.model, 'draw', this.draw);
      this.listenTo(this.model, 'doneRecording', this.startScrolling);

      this.firstDraw = true;
      this.readyToDraw = false;
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

    draw: function(channels) {
      if (!this.readyToDraw) return false;
      
      var pcm = channels[0];
      
      var height = this.$waveform.height();
      var yCenter = height / 2;
      // start the path string with the cursor at x, yCenter
      // // adjust the sample rate based on the width of the element
      var inc = 64;

      if (this.firstDraw) {
        this.$waveform.width(0);
        this.paper = Raphael(this.$waveform[0], '100%', '100%');
        this.x = 0;
        console.log('x', this.x);
        this.y = yCenter;
        this.firstDraw = false;
      }
      
      var pathString = 'M' + this.x + ',' + this.y;

      // sample pcm and build path string
      for (var i = 0; i < pcm.length - 1; i += inc) {
        this.y = yCenter - Math.round(pcm[i] * 20);
        pathString += 'L'+ this.x + ',' + this.y + 'M' + this.x + ',' + this.y; 
        this.x++;
      }
      pathString += 'Z';


      console.log(pathString);
      // feed to path
      this.path = this.paper.path(pathString);
      var pixels = pcm.length / inc;
      this.$waveform.css({left: '-=' + pixels, width: '+=' + pixels});
      // for the pretty
      this.path.attr({'stroke': 'blue'});
      this.path.glow({'color': 'blue', 'width': 1, opacity: .3});
    },

    startScrolling: function() {
      var $svgClone = $(this.$('svg')[0].cloneNode(true));
      var $svgClone1 = $(this.$('svg')[0].cloneNode(true));
      $svgClone.css({'left':this.$waveform.width(), position: 'absolute'});
      $svgClone1.css({'left': -(this.$waveform.width()), position: 'absolute'});
      this.$waveform.append($svgClone);
      this.$waveform.append($svgClone1);

      this.listenTo(synth.metronome, 'beat', this.scrollWaveform);
    },

    scrollWaveform: function(beat) {
      var width = this.$waveform.width();
      
      if (((beat.number % this.model.get('numBeats')) - (this.model.get('startBeat') % this.model.get('numBeats')) === 0)) {
        this.$waveform.css({'left': this.$el.width() / 2});
      } else {
        this.$waveform.css({'left': '-=' + width / this.model.get('numBeats')});
      }
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
      this.$waveform = this.$('.waveform');
      return this;
    }
  });
})();
