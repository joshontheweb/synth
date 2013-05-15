(function() {
  'use strict';
  
  bs.views.PopupView = Backbone.View.extend({
    initialize: function(options) {
      this.$trigger = options.trigger;
      this.callback = options.callback;
      this.template = this.template || options.template;

      _.bindAll(this);
      $('body').click(this.bodyClick);
    },

    className: 'popup',

    bodyClick: function(e) {
      var $target = $(e.target);
      if ($target.is(this.$trigger)) {
        e.preventDefault();
        this.toggle();
      } else if (!$target.closest(this.$el).length) {
        if (this.$el.is(':visible')) {
          this.exit();
        }
      }
    },

    exit: function() {
      this.remove();
    },
    
    toggle: function() {
      if (this.$el.is(':visible')) {
        this.exit();
      } else {
        this.render();
      }
    },

    render: function() {
      this.$el.html(this.template());
      $('body').append(this.$el);
      return this;
    }
  });

})();
