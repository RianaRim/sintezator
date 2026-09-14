const audioCtx3 = new (window.AudioContext || window.webkitAudioContext)()

// --- BASS / ACCOMPANIMENT LINE ---
const avrilBassLine2 = [
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
  { frequency: 261.63, timing: 5769, duration: 385 }, // C4

  // --- MEASURE 3 ---
  { frequency: 103.83, timing: 6154, duration: 769 }, // G#2 (Back to Root)
  { frequency: 174.61, timing: 6538, duration: 769 }, // F3
  { frequency: 207.65, timing: 6923, duration: 769 }, // G#3
  { frequency: 261.63, timing: 7308, duration: 385 }, // C4
  { frequency: 130.81, timing: 7692, duration: 769 }, // C3
  { frequency: 207.65, timing: 8077, duration: 769 }, // G#3
  { frequency: 261.63, timing: 8462, duration: 769 }, // C4
  { frequency: 311.13, timing: 8846, duration: 385 }, // D#4

  // --- MEASURE 4 (Walkdown Variation) ---
  { frequency: 138.59, timing: 9231, duration: 769 }, // C#3
  { frequency: 207.65, timing: 9615, duration: 769 }, // G#3
  { frequency: 277.18, timing: 10000, duration: 769 }, // C#4
  { frequency: 311.13, timing: 10385, duration: 385 }, // D#4
  { frequency: 130.81, timing: 10769, duration: 769 }, // C3 (Walks down to C instead of A#)
  { frequency: 196.0, timing: 11154, duration: 769 }, // G3
  { frequency: 261.63, timing: 11538, duration: 769 }, // C4
  { frequency: 311.13, timing: 11923, duration: 385 }, // D#4

  // --- MEASURE 5 ---
  { frequency: 103.83, timing: 12308, duration: 769 }, // G#2 (Pattern restarts)
  { frequency: 174.61, timing: 12692, duration: 769 }, // F3
  { frequency: 207.65, timing: 13077, duration: 769 }, // G#3
  { frequency: 261.63, timing: 13462, duration: 385 }, // C4
  { frequency: 130.81, timing: 13846, duration: 769 }, // C3
  { frequency: 207.65, timing: 14231, duration: 769 }, // G#3
  { frequency: 261.63, timing: 14615, duration: 769 }, // C4
  { frequency: 311.13, timing: 15000, duration: 385 }, // D#4

  // --- MEASURE 6 ---
  { frequency: 138.59, timing: 15385, duration: 769 }, // C#3
  { frequency: 207.65, timing: 15769, duration: 769 }, // G#3
  { frequency: 277.18, timing: 16154, duration: 769 }, // C#4
  { frequency: 311.13, timing: 16538, duration: 385 }, // D#4
  { frequency: 116.54, timing: 16923, duration: 769 }, // A#2
  { frequency: 207.65, timing: 17308, duration: 769 }, // G#3
  { frequency: 277.18, timing: 17692, duration: 769 }, // C#4
  { frequency: 261.63, timing: 18077, duration: 385 }, // C4

  // --- MEASURE 7 ---
  { frequency: 103.83, timing: 18462, duration: 769 }, // G#2
  { frequency: 174.61, timing: 18846, duration: 769 }, // F3
  { frequency: 207.65, timing: 19231, duration: 769 }, // G#3
  { frequency: 261.63, timing: 19615, duration: 385 }, // C4
  { frequency: 130.81, timing: 20000, duration: 769 }, // C3
  { frequency: 207.65, timing: 20385, duration: 769 }, // G#3
  { frequency: 261.63, timing: 20769, duration: 769 }, // C4
  { frequency: 311.13, timing: 21154, duration: 385 }, // D#4

  // --- MEASURE 8 ---
  { frequency: 138.59, timing: 21538, duration: 769 }, // C#3
  { frequency: 207.65, timing: 21923, duration: 769 }, // G#3
  { frequency: 277.18, timing: 22308, duration: 769 }, // C#4
  { frequency: 311.13, timing: 22692, duration: 385 }, // D#4
  { frequency: 130.81, timing: 23077, duration: 769 }, // C3 (Prepares loop reset)
  { frequency: 196.0, timing: 23462, duration: 769 }, // G3
  { frequency: 261.63, timing: 23846, duration: 769 }, // C4
  { frequency: 207.65, timing: 24231, duration: 385 }, // G#3

  // --- MEASURE 9 ---
  { frequency: 103.83, timing: 24615, duration: 769 }, // G#2
  { frequency: 174.61, timing: 25000, duration: 769 }, // F3
  { frequency: 207.65, timing: 25385, duration: 769 }, // G#3
  { frequency: 261.63, timing: 25769, duration: 385 }, // C4
  { frequency: 130.81, timing: 26154, duration: 769 }, // C3
  { frequency: 207.65, timing: 26538, duration: 769 }, // G#3
  { frequency: 261.63, timing: 26923, duration: 769 }, // C4
  { frequency: 311.13, timing: 27308, duration: 385 }, // D#4

  // --- MEASURE 10 ---
  { frequency: 138.59, timing: 27692, duration: 769 }, // C#3
  { frequency: 207.65, timing: 28077, duration: 769 }, // G#3
  { frequency: 277.18, timing: 28462, duration: 769 }, // C#4
  { frequency: 311.13, timing: 28846, duration: 385 }, // D#4
  { frequency: 116.54, timing: 29231, duration: 769 }, // A#2
  { frequency: 207.65, timing: 29615, duration: 769 }, // G#3
  { frequency: 277.18, timing: 30000, duration: 769 }, // C#4
  { frequency: 261.63, timing: 30385, duration: 385 }, // C4

  // --- MEASURE 11 ---
  { frequency: 103.83, timing: 30769, duration: 769 }, // G#2
  { frequency: 174.61, timing: 31154, duration: 769 }, // F3
  { frequency: 207.65, timing: 31538, duration: 769 }, // G#3
  { frequency: 261.63, timing: 31923, duration: 385 }, // C4
  { frequency: 130.81, timing: 32308, duration: 769 }, // C3
  { frequency: 207.65, timing: 32692, duration: 769 }, // G#3
  { frequency: 261.63, timing: 33077, duration: 769 }, // C4
  { frequency: 311.13, timing: 33462, duration: 385 }, // D#4

  // --- MEASURE 12 ---
  { frequency: 138.59, timing: 33846, duration: 769 }, // C#3
  { frequency: 207.65, timing: 34231, duration: 769 }, // G#3
  { frequency: 277.18, timing: 34615, duration: 769 }, // C#4
  { frequency: 311.13, timing: 35000, duration: 385 }, // D#4
  { frequency: 130.81, timing: 35385, duration: 769 }, // C3
  { frequency: 196.0, timing: 35769, duration: 769 }, // G3
  { frequency: 261.63, timing: 36154, duration: 769 }, // C4
  { frequency: 311.13, timing: 36538, duration: 385 }, // D#4

  //   13 - 16
  { frequency: 103.83, timing: 36923, duration: 769 },
  { frequency: 174.61, timing: 37308, duration: 769 },
  { frequency: 207.65, timing: 37692, duration: 769 },
  { frequency: 261.63, timing: 38077, duration: 385 },
  { frequency: 130.81, timing: 38462, duration: 769 },
  { frequency: 207.65, timing: 38846, duration: 769 },
  { frequency: 261.63, timing: 39231, duration: 769 },
  { frequency: 311.13, timing: 39615, duration: 385 },
  { frequency: 138.59, timing: 40000, duration: 769 },
  { frequency: 207.65, timing: 40385, duration: 769 },
  { frequency: 277.18, timing: 40769, duration: 769 },
  { frequency: 311.13, timing: 41154, duration: 385 },
  { frequency: 116.54, timing: 41538, duration: 769 },
  { frequency: 207.65, timing: 41923, duration: 769 },
  { frequency: 277.18, timing: 42308, duration: 769 },
  { frequency: 261.63, timing: 42692, duration: 385 },
  { frequency: 103.83, timing: 43077, duration: 769 },
  { frequency: 174.61, timing: 43462, duration: 769 },
  { frequency: 207.65, timing: 43846, duration: 769 },
  { frequency: 261.63, timing: 44231, duration: 385 },
  { frequency: 130.81, timing: 44615, duration: 769 },
  { frequency: 207.65, timing: 45000, duration: 769 },
  { frequency: 261.63, timing: 45385, duration: 769 },
  { frequency: 311.13, timing: 45769, duration: 385 },
  { frequency: 138.59, timing: 46154, duration: 769 },
  { frequency: 207.65, timing: 46538, duration: 769 },
  { frequency: 277.18, timing: 46923, duration: 769 },
  { frequency: 311.13, timing: 47308, duration: 385 },
  { frequency: 130.81, timing: 47692, duration: 769 },
  { frequency: 196.0, timing: 48077, duration: 769 },
  { frequency: 261.63, timing: 48462, duration: 769 },
  { frequency: 207.65, timing: 48846, duration: 385 }
]

// --- MAIN / MELODY LINE ---
const avrilMainLine2 = [
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
  { frequency: 415.3, timing: 5769, duration: 385 }, // G#4

  // --- MEASURE 3 ---
  { frequency: 523.25, timing: 6154, duration: 1154 }, // C5
  { frequency: 349.23, timing: 7308, duration: 385 }, // F4
  { frequency: 415.3, timing: 7692, duration: 1154 }, // G#4
  { frequency: 415.3, timing: 8846, duration: 385 }, // G#4

  // --- MEASURE 4 (Melody Resolves Higher) ---
  { frequency: 349.23, timing: 10385, duration: 385 }, // F4
  { frequency: 698.46, timing: 10769, duration: 769 }, // F5 (High peak note)
  { frequency: 622.25, timing: 11538, duration: 385 }, // D#5
  { frequency: 523.25, duration: 385, timing: 11923 }, // C5

  // --- MEASURE 5 ---
  { frequency: 523.25, timing: 12308, duration: 1154 }, // C5
  { frequency: 349.23, timing: 13462, duration: 385 }, // F4
  { frequency: 415.3, timing: 13846, duration: 1154 }, // G#4
  { frequency: 415.3, timing: 15000, duration: 385 }, // G#4

  // --- MEASURE 6 ---
  { frequency: 349.23, timing: 16538, duration: 385 }, // F4
  { frequency: 622.25, timing: 16923, duration: 385 }, // D#5
  { frequency: 554.37, timing: 17308, duration: 385 }, // C#5
  { frequency: 523.25, timing: 17692, duration: 385 }, // C5
  { frequency: 415.3, timing: 18077, duration: 385 }, // G#4

  // --- MEASURE 7 ---
  { frequency: 523.25, timing: 18462, duration: 1154 }, // C5
  { frequency: 349.23, timing: 19615, duration: 385 }, // F4
  { frequency: 415.3, timing: 20000, duration: 1154 }, // G#4
  { frequency: 415.3, timing: 21154, duration: 385 }, // G#4

  // --- MEASURE 8 (Melody Decays / Rests) ---
  { frequency: 349.23, timing: 22692, duration: 385 }, // F4
  { frequency: 415.3, timing: 23077, duration: 1154 }, // G#4 (Sustains long over the reset)

  // --- MEASURE 9 ---
  { frequency: 1046.5, timing: 24615, duration: 1154 }, // C6 (Jumped up 1 octave)
  { frequency: 698.46, timing: 25769, duration: 385 }, // F5
  { frequency: 830.61, timing: 26154, duration: 1154 }, // G#5
  { frequency: 830.61, timing: 27308, duration: 385 }, // G#5

  // --- MEASURE 10 ---
  { frequency: 698.46, timing: 28846, duration: 385 }, // F5
  { frequency: 1244.51, timing: 29231, duration: 385 }, // D#6
  { frequency: 1108.73, timing: 29615, duration: 385 }, // C#6
  { frequency: 1046.5, timing: 30000, duration: 385 }, // C6
  { frequency: 830.61, timing: 30385, duration: 385 }, // G#5

  // --- MEASURE 11 ---
  { frequency: 1046.5, timing: 30769, duration: 1154 }, // C6
  { frequency: 698.46, timing: 31923, duration: 385 }, // F5
  { frequency: 830.61, timing: 32308, duration: 1154 }, // G#5
  { frequency: 830.61, timing: 33462, duration: 385 }, // G#5

  // --- MEASURE 12 (Melody Peak) ---
  { frequency: 698.46, timing: 35000, duration: 385 }, // F5
  { frequency: 1396.91, timing: 35385, duration: 769 }, // F6 (Highest note in the phrase)
  { frequency: 1244.51, timing: 36154, duration: 385 }, // D#6
  { frequency: 1046.5, timing: 36538, duration: 385 }, // C6

  //   13 - 16
  { frequency: 1046.5, timing: 36923, duration: 1154 },
  { frequency: 698.46, timing: 38077, duration: 385 },
  { frequency: 830.61, timing: 38462, duration: 1154 },
  { frequency: 830.61, timing: 39615, duration: 385 },
  { frequency: 698.46, timing: 41154, duration: 385 },
  { frequency: 1244.51, timing: 41538, duration: 385 },
  { frequency: 1108.73, timing: 41923, duration: 385 },
  { frequency: 1046.5, timing: 42308, duration: 385 },
  { frequency: 830.61, timing: 42692, duration: 385 },
  { frequency: 1046.5, timing: 43077, duration: 1154 },
  { frequency: 698.46, timing: 44231, duration: 385 },
  { frequency: 830.61, timing: 44615, duration: 1154 },
  { frequency: 830.61, timing: 45769, duration: 385 },
  { frequency: 698.46, timing: 47308, duration: 385 },
  { frequency: 830.61, timing: 47692, duration: 1154 }
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
  const master = audioCtx3.createGain()
  master.gain.value = 0.8
  master.connect(audioCtx3.destination)

  playVoice(audioCtx3, avrilBassLine2, master, { type: 'sine', gain: 0.35 })
  playVoice(audioCtx3, avrilMainLine2, master, {
    type: 'triangle',
    gain: 0.25
  })
}

document.getElementById('playBtn3').addEventListener('click', () => {
  audioCtx3.resume()
  playTrack()
})
