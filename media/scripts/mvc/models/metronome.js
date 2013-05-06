(function() {
  'use strict';

  bs.models.Metronome = Backbone.Model.extend({
    initialize: function(attrs) {
      this.context = attrs.context;
      this.gainNode = this.context.createGainNode();
      
      this.nextNoteTime = 0.0;        // when the next note is due.
      this.lookAhead = 0.25;          // How frequently to call scheduling function
      this.notesInQueue = [];         // notes to play
      this.timeOutId = 0;             // setTimeout Id
      this.noteResolution = 0;	      // 0 == 16th, 1 == 8th, 2 == quarter note 
      this.noteLength = 0.01          // length of beep
      this.scheduleAheadTime = 0.1;	  // How far ahead to schedule audio (sec) 
      this.current16thNote = 1;

      this.gainNode.gain.value = this.get('state') ? 1 : 0;
      
      this.on('change:state', this.stateChange);
      this.on('beat', this.beat);
      
      this.start();

    },

    defaults: {
      state: false, // false = off, true = on
      gain: 1,
      tempo: 90,
    },

    beat: function(beat) {
      // console.log(beat);
    },
    
    stateChange: function(model, state) {
      this.gainNode.gain.value = state ? 1 : 0;
    },
    
    start: function() {
      this.scheduler();
    },

    scheduler: function() {
      if (!this.context) {
        console.log('hlarr');
      }
      while (this.nextNoteTime < this.context.currentTime + this.scheduleAheadTime) {
        this.scheduleNote(this.current16thNote, this.nextNoteTime);
		this.nextNote(); 
      }

      this.timerId = setTimeout(_.bind(this.scheduler, this), this.lookAhead);
    },

    scheduleNote: function(beatNumber, time) {
      var model = this;
      // push the note on the queue, even if we're not playing.
      this.notesInQueue.push({ note: beatNumber, time: time });

      if ( (this.noteResolution==1) && (beatNumber%2))
          return;	// we're not playing non-8th 16th notes
      if ( (this.noteResolution==2) && (beatNumber%4))
          return;	// we're not playing non-quarter 8th notes

      // create an oscillator
      var osc = this.context.createOscillator();
      osc.connect(this.gainNode);
      if (! (beatNumber % 16) )	// beat 0 == low pitch
          osc.frequency.value = 220.0;
      else if (beatNumber % 4)	// quarter notes = medium pitch
          osc.frequency.value = 440.0;
      else						// other 16th notes = high pitch
          osc.frequency.value = 880.0;

      // TODO: Once start()/stop() deploys on Safari and iOS, these should be changed.
      osc.start(time);
      model.trigger('beat', {number: beatNumber, time: time});
      osc.stop( time + this.noteLength ); 
    },

    nextNote: function() {
      // Advance current note and time by a 16th note...
      var secondsPerBeat = 60.0 / this.get('tempo');	// Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
      this.nextNoteTime += 0.25 * secondsPerBeat;	// Add beat length to last beat time

      this.current16thNote++;	// Advance the beat number, wrap to zero
      
      if (this.current16thNote == 64) {
        this.current16thNote = 0;
      } 
    },
    
    tempoChange: function(model, tempo) {
      this.squareWave.frequency.value = frequency;
    },

    connect: function(node) {
      this.gainNode.connect(node);
    }
  });
})();
