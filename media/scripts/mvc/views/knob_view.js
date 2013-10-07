(function() {
  'use strict';
  
  bs.views.KnobView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);

      this.listenTo(this.model, 'change:value', this.valueChange);
      this.listenTo(this.model, 'change:max', this.maxChange);
      this.degreeRange = 280;
      this.pixelRange = 280;
    },
    
    template: _.template($('.knob-template').html()),

    className: 'knob-wrapper',

    events: {
      'mousedown': 'handleMouseDown',
      'mouseup': 'handleMouseUp'
    },

    valueChange: function(model, value) {
      var value = this.model.get('value');
      var degrees = ((value / this.range) * this.degreeRange);
      this.rotateEl(this.$knob, degrees);
    },

    handleMouseDown: function(e) {
      this.startDrag(e);
      this.listenToMouseUp();
    },

    handleMouseUp: function(e) {
      this.stopDrag();
    },

    startDrag: function(e) {
      $(document).bind('mousemove', this.dragCallback);
      $('body').addClass('unselectable');
      this.startY = e.pageY;
      this.startVal = this.model.get('value');
    },

    stopDrag: function() {
      $(document).unbind('mousemove', this.dragCallback);
      $('body').removeClass('unselectable');
    },

    listenToMouseUp: function() {
      $(document).bind('mouseup', this.handleMouseUp);
    },

    unlistenToMouseUp: function() {
      $(document).unbind('mouseup', this.handleMouseUp)
    },

    dragCallback: function(e) {
      
      var pixelDiff = this.startY - e.pageY;

      // minute adjust if shift key is held
      var pixelRange = e.shiftKey ? this.range : this.pixelRange
      
      var value = (pixelDiff / pixelRange) * this.range;
      value += new Number(this.startVal);
      
      if (value >= this.model.get('max')) {
        this.model.set({value: this.model.get('max')});
      } else if (value <= this.model.get('min')) {
        this.model.set({value: this.model.get('min')});
      } else {
        this.model.set({value: (value * this.model.get('decimalPlace')) / this.model.get('decimalPlace')});
      }
    },

    maxChange: function(model, max) {
      this.range = max - this.model.get('min');
    },

    rotateEl: function($el, degrees) {
      $el.css({
        '-webkit-transform' : 'rotate('+degrees+'deg)',
           '-moz-transform' : 'rotate('+degrees+'deg)',  
            '-ms-transform' : 'rotate('+degrees+'deg)',  
             '-o-transform' : 'rotate('+degrees+'deg)',  
                'transform' : 'rotate('+degrees+'deg)',  
                     'zoom' : 1
      });
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$knob = this.$('.knob');
      this.$indicator = this.$('.indicator');

      this.rotateEl(this.$indicator, this.model.get('startDegree'));
      this.range = this.model.get('max') - this.model.get('min');
      var degrees = (this.model.get('value') / this.range) * this.degreeRange;
      this.rotateEl(this.$knob, degrees);
      return this;
    }
  });
  
})();
