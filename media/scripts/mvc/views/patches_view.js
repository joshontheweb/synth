(function() {
  'use strict';

  bs.views.PatchesView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.collection, 'add', this.insertPatch);
    },
    
    template: _.template($('.patches-template').html()),

    patchTemplate: _.template($('.patch-template').html()),

    events: {
      'click .save-patch': 'savePatch',
      'change .patches': 'loadPatch'
    },

    insertPatch: function(patch) {
      this.$patches.append(this.patchTemplate(patch.toJSON()));
    },

    savePatch: function(e) {
      e.preventDefault();
      synth.savePatch();
    },

    loadPatch: function(e) {
      var patch = this.collection.get(e.target.value);
      synth.loadPatch(patch.get('parameters'));
    },

    render: function() {
      var view = this;
      this.$el.html(this.template());
      this.$patches = this.$('.patches');

      this.collection.each(function(patch) {
        view.insertPatch(patch);
      });
      
      return this;
    }
  });
})();
