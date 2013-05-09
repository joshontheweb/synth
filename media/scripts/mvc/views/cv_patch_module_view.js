(function() {
  'use strict';

  bs.views.CVPatchModuleView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model.cvPatches, 'add', this.insertPatch);
      this.listenTo(this.model.cvPatches, 'reset', this.render);
    },

    template: _.template($('.cv-patches-template').html()),

    insertPatch: function(patch) {
      var patchView = new bs.views.CVPatchView({model: patch});
      this.$patchesList.append(patchView.render().el);
    },

    render: function() {
      var view = this;
      this.$el.html(this.template());
      this.$patchesList = this.$('.cv-patches-list')

      this.model.cvPatches.each(function(patch) {
        view.insertPatch(patch);
      });
      
      return this;
    }
  });
})();
