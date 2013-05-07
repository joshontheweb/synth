(function() {
  'use strict';

  bs.views.PatchView = Backbone.View.extend({
    template: _.template($('.patch-template').html()),

    tagName: 'option',

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.attr({value: this.model._id});
      return this;
    }
  });
})();
