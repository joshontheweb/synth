(function() {
  'use strict';

  bs.views.BufferView = Backbone.View.extend({
    events: {
      'click': 'clear',
    },
    
    template: _.template($('.buffer-template').html()),

    clear: function(e) {
      this.model.collection.remove(this.model);
      this.model.get('source').stop(0);
      this.model = false;
      this.remove();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
})();
