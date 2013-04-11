(function() {
  window.synth = new bs.models.Synth();
  window.synthView = new bs.views.SynthView({model: window.synth, el: $('.main')});
  window.synthView.render();
})();
