// Luxury Web Audio API Synthesizer (No external asset dependencies)
class LuxurySoundEngine {
  constructor() {
    this.ctx = null;
    this.musicPlaying = false;
    this.musicTimer = null;
    this.sfxEnabled = true;
    this.musicEnabled = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft crystal chime when decoration is placed
  playPlace() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12); // E6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.42);
    } catch {
      // Audio context policy safe fallback
    }
  }

  // Soft gentle pop/whoosh when decoration is removed or undone
  playRemove() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.15);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // safe fallback
    }
  }

  // Magical bell sparkle when hint is activated
  playHint() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [1046.5, 1318.5, 1567.98, 2093.0]; // C6, E6, G6, C7
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.14, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.52);
      });
    } catch {
      // safe fallback
    }
  }

  // Grand celebration glissando when cake is completed
  playSuccess() {
    if (!this.sfxEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.5, 1567.98];
      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.09;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 1.25);
      });
    } catch {
      // safe fallback
    }
  }

  // Romantic ambient harp progression loop
  toggleMusic(enable) {
    if (enable === undefined) {
      this.musicEnabled = !this.musicEnabled;
    } else {
      this.musicEnabled = enable;
    }

    if (this.musicEnabled) {
      this.init();
      this.startAmbientHarp();
    } else {
      this.stopAmbientHarp();
    }
    return this.musicEnabled;
  }

  startAmbientHarp() {
    if (this.musicPlaying) return;
    this.musicPlaying = true;

    // Romantic chord progression: Fmaj7 -> Cmaj7 -> Dm7 -> Bbmaj7
    const progression = [
      [349.23, 440.0, 523.25, 659.25], // F, A, C, E
      [261.63, 329.63, 392.0, 493.88], // C, E, G, B
      [293.66, 349.23, 440.0, 523.25], // D, F, A, C
      [233.08, 293.66, 349.23, 440.0], // Bb, D, F, A
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.musicPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const currentChord = progression[chordIndex];

      currentChord.forEach((freq, idx) => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const noteTime = now + idx * 0.45;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.035, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.0005, noteTime + 1.6);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 1.65);
        } catch {
          // safe
        }
      });

      chordIndex = (chordIndex + 1) % progression.length;
      this.musicTimer = setTimeout(playNextChord, 2200);
    };

    playNextChord();
  }

  stopAmbientHarp() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }
}

export const luxuryAudio = new LuxurySoundEngine();
