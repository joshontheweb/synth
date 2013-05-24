(function() {
  'use strict';

  bs.views.KeyboardView = Backbone.View.extend({
    initialize: function() {
      this.model.pressed = 0;
    },

    template: _.template($('.keyboard-template').html()),

    initKeyboard: function() {
      var view = this;
      this.model.keyboard = qwertyHancock({id: 'keyboard', startNote: 'C3'});
      
      this.model.keyboard.keyDown(function(note, freq) {
        view.model.pressed += 1;
        view.model.trigger('keyDown', note, freq);
      });
      
      this.model.keyboard.keyUp(function(note, freq) {
        view.model.pressed -= 1;
        view.model.trigger('keyUp', note, freq);
      });
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      
      this.initKeyboard();
      
      return this;
    }
  });
})();
