const audioCtx1 = new (window.AudioContext || window.webkitAudioContext)()

// --- Ноты с частотой, таймингом и длительностью ---
const avril14thIntroWithDurations = [
  // --- MEASURE 1 ---
  { frequency: 103.83, timing: 0, duration: 769 }, // G#2 (Bass root, sustains 1 beat)
  { frequency: 523.25, timing: 0, duration: 1154 }, // C5 (Melody, sustains 3 eighth notes)
  { frequency: 174.61, timing: 385, duration: 769 }, // F3
  { frequency: 207.65, timing: 769, duration: 769 }, // G#3
  { frequency: 261.63, timing: 1154, duration: 385 }, // C4
  { frequency: 349.23, timing: 1154, duration: 385 }, // F4 (Melody)
  { frequency: 130.81, timing: 1538, duration: 769 }, // C3
  { frequency: 415.3, timing: 1538, duration: 1154 }, // G#4 (Melody, sustains 3 eighth notes)
  { frequency: 207.65, timing: 1923, duration: 769 }, // G#3
  { frequency: 261.63, timing: 2308, duration: 769 }, // C4
  { frequency: 311.13, timing: 2692, duration: 385 }, // D#4
  { frequency: 415.3, timing: 2692, duration: 385 }, // G#4 (Melody)

  // --- MEASURE 2 ---
  { frequency: 138.59, timing: 3077, duration: 769 }, // C#3
  { frequency: 207.65, timing: 3462, duration: 769 }, // G#3
  { frequency: 277.18, timing: 3846, duration: 769 }, // C#4
  { frequency: 311.13, timing: 4231, duration: 385 }, // D#4
  { frequency: 349.23, timing: 4231, duration: 385 }, // F4 (Melody)
  { frequency: 116.54, timing: 4615, duration: 769 }, // A#2
  { frequency: 622.25, timing: 4615, duration: 385 }, // D#5 (Melody)
  { frequency: 207.65, timing: 5000, duration: 769 }, // G#3
  { frequency: 554.37, timing: 5000, duration: 385 }, // C#5 (Melody)
  { frequency: 277.18, timing: 5385, duration: 769 }, // C#4
  { frequency: 523.25, timing: 5385, duration: 385 }, // C5 (Melody)
  { frequency: 261.63, timing: 5769, duration: 385 }, // C4
  { frequency: 415.3, timing: 5769, duration: 385 } // G#4 (Melody)
]

// Порог для разделения на бас/мелодию (Гц). Всё что ниже — бас-голос.
const BASS_THRESHOLD = 220

function buildVoices(notes) {
  return notes.map((n) => ({
    freq: n.frequency,
    start: n.timing / 1000, // мс -> сек
    dur: (n.duration ?? 400) / 1000, // fallback на случай пропуска поля
    isBass: n.frequency <= BASS_THRESHOLD
  }))
}

function playNote(ctx, { freq, start, dur, isBass }, destination) {
  const osc = ctx.createOscillator()
  const env = ctx.createGain()

  osc.type = isBass ? 'sine' : 'triangle'
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start)

  const t0 = ctx.currentTime + start
  const gain = isBass ? 0.35 : 0.22

  env.gain.setValueAtTime(0, t0)
  env.gain.linearRampToValueAtTime(gain, t0 + 0.008)
  // Спад чуть плавнее относительно длительности ноты
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)

  osc.connect(env).connect(destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

function playTrack(notes) {
  const master = audioCtx1.createGain()
  master.gain.value = 0.8
  master.connect(audioCtx1.destination)

  const voices = buildVoices(notes)
  voices.forEach((v) => playNote(audioCtx1, v, master))
}

document.getElementById('playBtn1').addEventListener('click', () => {
  audioCtx1.resume()
  playTrack(avril14thIntroWithDurations)
})
