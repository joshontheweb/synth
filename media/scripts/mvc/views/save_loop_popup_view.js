(function() {
  'use strict';
  
  bs.views.SaveLoopPopupView = bs.views.PopupView.extend({
    template: _.template($('.save-loop-popup-template').html()),

    events: {
      'click .save': 'saveLoop',
      'keydown .loop-name': 'handleKeypress'
    },

    handleKeypress: function(e) {
      if (e.keyCode == 13) { // enter
        this.saveLoop(e);
      } 

      if (e.keyCode == 27) { // escape
        this.exit();
      }
    },

    exit: function() {
      var view = this;
      this.$el.html('<h3>Thanks for sharing!</h3>');
      this.$el.fadeOut(1500, function() {
        view.remove();
      });
    },

    saveLoop: function(e) {
      e.preventDefault();
      var name = this.$name.val();
      this.callback(name);
    },

    render: function() {
      this.$el.html(this.template());
      $('body').append(this.$el);
      this.$name = this.$('.loop-name');
      this.$name.focus();
      return this;
    }
  });
})();
