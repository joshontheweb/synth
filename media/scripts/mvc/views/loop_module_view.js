(function() {
  'use strict';

  bs.views.LoopModuleView = Backbone.View.extend({
    initialize: function() {
      var view = this;
      $(window).on('keydown', function(e) {
        view.handleKeydown(e);
      });

      this.listenTo(this.model.buffers, 'add', this.insertBuffer);
    },

    template: _.template($('.loop-module-template').html()),

    handleKeydown: function(e) {
      if (e.keyCode == 192) { // ~
        if (this.model.recording) {
          this.model.stopRecording();
        } else {
          this.model.startRecording();
        }
      }
    },

    insertBuffer: function(buffer) {
      var bufferView = new bs.views.BufferView({model: buffer});
      this.$el.append(bufferView.render().el);
      bufferView.drawWaveform();
      bufferView.drawWaveform();
    },
    
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });
})();
