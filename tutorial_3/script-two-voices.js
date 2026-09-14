const audioCtx2 = new (window.AudioContext || window.webkitAudioContext)()

// --- BASS / ACCOMPANIMENT LINE ---
const avrilBassLine1 = [
  // Measure 1
  { frequency: 103.83, timing: 0, duration: 769 }, // G#2
  { frequency: 174.61, timing: 385, duration: 769 }, // F3
  { frequency: 207.65, timing: 769, duration: 769 }, // G#3
  { frequency: 261.63, timing: 1154, duration: 385 }, // C4
  { frequency: 130.81, timing: 1538, duration: 769 }, // C3
  { frequency: 207.65, timing: 1923, duration: 769 }, // G#3
  { frequency: 261.63, timing: 2308, duration: 769 }, // C4
  { frequency: 311.13, timing: 2692, duration: 385 }, // D#4

  // Measure 2
  { frequency: 138.59, timing: 3077, duration: 769 }, // C#3
  { frequency: 207.65, timing: 3462, duration: 769 }, // G#3
  { frequency: 277.18, timing: 3846, duration: 769 }, // C#4
  { frequency: 311.13, timing: 4231, duration: 385 }, // D#4
  { frequency: 116.54, timing: 4615, duration: 769 }, // A#2
  { frequency: 207.65, timing: 5000, duration: 769 }, // G#3
  { frequency: 277.18, timing: 5385, duration: 769 }, // C#4
  { frequency: 261.63, timing: 5769, duration: 385 } // C4
]

// --- MAIN / MELODY LINE ---
const avrilMainLine1 = [
  // Measure 1
  { frequency: 523.25, timing: 0, duration: 1154 }, // C5
  { frequency: 349.23, timing: 1154, duration: 385 }, // F4
  { frequency: 415.3, timing: 1538, duration: 1154 }, // G#4
  { frequency: 415.3, timing: 2692, duration: 385 }, // G#4

  // Measure 2
  { frequency: 349.23, timing: 4231, duration: 385 }, // F4
  { frequency: 622.25, timing: 4615, duration: 385 }, // D#5
  { frequency: 554.37, timing: 5000, duration: 385 }, // C#5
  { frequency: 523.25, timing: 5385, duration: 385 }, // C5
  { frequency: 415.3, timing: 5769, duration: 385 } // G#4
]

// --- Проигрывание одной ноты одним осциллятором ---
function playNote(
  ctx,
  { frequency, timing, duration },
  destination,
  { type, gain }
) {
  const osc = ctx.createOscillator()
  const env = ctx.createGain()

  const start = timing / 1000
  const dur = duration / 1000
  const t0 = ctx.currentTime + start

  osc.type = type
  osc.frequency.setValueAtTime(frequency, t0)

  env.gain.setValueAtTime(0, t0)
  env.gain.linearRampToValueAtTime(gain, t0 + 0.008)
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  osc.connect(env).connect(destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

// --- Проигрывание целого голоса ---
function playVoice(ctx, notes, destination, options) {
  notes.forEach((n) => playNote(ctx, n, destination, options))
}

// --- Запуск трека: два "осциллятора" = два голоса с разным тембром ---
function playTrack() {
  const master = audioCtx2.createGain()
  master.gain.value = 0.8
  master.connect(audioCtx2.destination)

  playVoice(audioCtx2, avrilBassLine1, master, { type: 'sine', gain: 0.35 })
  playVoice(audioCtx2, avrilMainLine1, master, {
    type: 'triangle',
    gain: 0.25
  })
}

document.getElementById('playBtn2').addEventListener('click', () => {
  audioCtx2.resume()
  playTrack()
})
