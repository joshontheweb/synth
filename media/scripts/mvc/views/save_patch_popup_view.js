(function() {
  'use strict';
  
  bs.views.SavePatchPopupView = bs.views.PopupView.extend({
    template: _.template($('.save-patch-popup-template').html()),

    events: {
      'click .save': 'savePatch',
      'keydown .patch-name': 'handleKeypress'
    },

    handleKeypress: function(e) {
      e.stopPropagation();
      if (e.keyCode == 13) { // enter
        this.savePatch(e);
      } 

      if (e.keyCode == 27) { // escape
        this.exit();
      }
    },

    savePatch: function(e) {
      e.preventDefault();
      var name = this.$name.val();
      this.callback(name);
    },

    render: function() {
      this.$el.html(this.template());
      $('body').append(this.$el);
      this.$name = this.$('.patch-name');
      this.$name.focus();
      return this;
    }
  });
})();
