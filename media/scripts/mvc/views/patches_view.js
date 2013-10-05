(function() {
  'use strict';

  bs.views.PatchesView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this);
      this.listenTo(this.collection, 'add', this.insertPatch);
    },
    
    template: _.template($('.patches-template').html()),

    patchTemplate: _.template($('.patch-template').html()),

    events: {
      'change .patches': 'loadPatch'
    },

    insertPatch: function(patch) {
      this.$patches.append(this.patchTemplate(patch.toJSON()));
      
      if (patch.get('name') == synth.get('patch')) {
        this.$patches.val(patch.id);
      }
    },

    savePatchCallback: function(name) {
      this.savePatchPopupView.exit();
      this.savePatch(name);
    },

    savePatch: function(name) {
      synth.set({patch: name});
      synth.savePatch(name);
    },

    loadPatch: function(e) {
      this.$patches.blur();
      var patch = this.collection.get(e.target.value);
      synth.loadPatch(patch.get('parameters'));
      router.navigate('/' + patch.get('name').replace(' ', '-'));
    },

    initSavePatchPopup: function() {
      this.savePatchPopupView = new bs.views.SavePatchPopupView({trigger: this.$('.save-patch'), callback: this.savePatchCallback});
    },

    render: function() {
      var view = this;
      this.$el.html(this.template());
      this.$patches = this.$('.patches');

      this.collection.each(function(patch) {
        view.insertPatch(patch);
      });

      this.initSavePatchPopup();
      
      return this;
    }
  });
})();
