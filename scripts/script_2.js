const SECTIONS = [
  { id: 'intro', title: 'Начало', bars: 4 }, // такты 1–4   (доли 0–15)
  { id: 'middle', title: 'Середина', bars: 7.5 }, // такты 5–12  (доли 0–31)
  { id: 'end', title: 'Конец', bars: 4 } // такты 13–16 (доли 0–15)
]

const SCORE = {
  melodyMax: {
    intro: [
      { beat: 0, name: 'A4', len: 2 },
      { beat: 1, name: 'A4', len: 2 },
      { beat: 1.5, name: 'E4', len: 2 },
      { beat: 2, name: 'D4', len: 2 },
      { beat: 2.5, name: 'C3', len: 3 },
      { beat: 3, name: 'A3', len: 2 },
      { beat: 3.5, name: 'C4', len: 2 },
      { beat: 4, name: 'D4', len: 2 },
      { beat: 4.5, name: 'C4', len: 3 },
      { beat: 5, name: 'A3', len: 3, velocity: 0.6 }
    ],

    middle: [
      { beat: 0, name: 'C4', len: 2, velocity: 0.5 },
      { beat: 2, name: 'E4', len: 2, velocity: 0.5 },
      { beat: 4.5, name: 'E4', len: 1 },
      { beat: 5, name: 'E4', len: 1 },
      { beat: 5.5, name: 'D4', len: 1 },
      { beat: 6, name: 'C4', len: 1 },
      { beat: 6.5, name: 'A3', len: 2 },
      { beat: 7, name: 'A3', len: 1 },
      { beat: 7.5, name: 'C4', len: 1 },
      { beat: 8, name: 'D4', len: 1 },
      { beat: 8.5, name: 'C4', len: 2 }
    ],

    end: [
      { beat: 0, name: 'C4', len: 3 },
      { beat: 1.5, name: 'D4', len: 2 },
      { beat: 2, name: 'C4', len: 3 },
      { beat: 2.5, name: 'A3', len: 2 },
      { beat: 3, name: 'A3', len: 3 },
      { beat: 3.5, name: 'C4', len: 2 },
      { beat: 4, name: 'D4', len: 3 },
      { beat: 4.5, name: 'E4', len: 2 }
    ]
  },

  melodyChloe: {
    intro: [
      { beat: 0, name: 'A3', len: 2, velocity: 0.6 },
      { beat: 8, name: 'D4', len: 2, velocity: 0.3 }
    ],

    middle: [
      { beat: 0, name: 'A4', len: 1 },
      { beat: 1, name: 'E4', len: 2 },
      { beat: 1.5, name: 'D4', len: 1 },
      { beat: 2, name: 'C3', len: 2 },
      { beat: 2.5, name: 'D4', len: 1 },
      { beat: 3, name: 'C4', len: 2 },
      { beat: 3.5, name: 'A3', len: 1 },
      { beat: 4, name: 'C4', len: 2 },
      { beat: 4.5, name: 'A4', len: 1 },
      { beat: 5, name: 'C4', len: 2 },
      { beat: 5.5, name: 'E4', len: 1 },
      { beat: 6, name: 'A4', len: 2 },
      { beat: 6.5, name: 'C4', len: 1 },
      { beat: 7, name: 'A4', len: 2 },
      { beat: 7.5, name: 'A3', len: 1 },
      { beat: 8, name: 'D4', len: 2 }
    ],

    end: [
      { beat: 5, name: 'A4', len: 1 },
      { beat: 6, name: 'E4', len: 2 },
      { beat: 7, name: 'D4', len: 2 },
      { beat: 8, name: 'C3', len: 1 },
      { beat: 9, name: 'D4', len: 1 },
      { beat: 10, name: 'A4', len: 2 },
      { beat: 11, name: 'G3', len: 2 },
      { beat: 12, name: 'A3', len: 1 }
    ]
  }
}

// ============ ОБЩИЕ ЧИСЛА ============
// темп, при котором мелодия звучит «как записана»
const BASE_BPM = 78

// сколько секунд длится одна доля при этом темпе
const SEC_PER_BEAT = 45 / BASE_BPM

// ============ ПЕРЕВОДЧИК: партитура → события для Tone.Part ============
// voiceScore — ноты одного голоса (например, SCORE.melodyMax)
// sections — список блоков (Начало, Середина, Конец)
// Результат — один длинный список нот, где время считается в секундах
function buildEvents(voiceScore, sections) {
  const events = []
  let offset = 0

  sections.forEach((section) => {
    const notes = voiceScore[section.id]

    notes.forEach((n) => {
      events.push({
        time: (offset + n.beat) * SEC_PER_BEAT,
        noteName: n.name,
        duration: n.len * SEC_PER_BEAT,
        velocity: n.velocity
      })
    })

    offset += section.bars * 4
  })

  return events
}

// ============ ФУНКЦИЯ, КОТОРАЯ СОБИРАЕТ ОДИН ГОЛОС ============
// sectionId — id блока на странице ('max' или 'chloe'), voiceScore — ноты голоса.
function createVoice(
  sectionId,
  oscId,
  filterId,
  echoId,
  reverbId,
  voiceScore,
  sections
) {
  const box = document.getElementById(sectionId)
  const oscBox = document.getElementById(oscId)
  const filterBox = document.getElementById(filterId)
  const echoBox = document.getElementById(echoId)
  const reverbBox = document.getElementById(reverbId)

  // элементы управления (по классам из HTML)
  const playBtn = box.querySelector('.play-btn')
  const stopBtn = box.querySelector('.stop-btn')
  const tempo = box.querySelector('.tempo')
  const volume = box.querySelector('.volume')
  const wave = oscBox.querySelector('.wave')
  const octave = oscBox.querySelector('.octave')
  const detune = oscBox.querySelector('.detune')
  const filterType = filterBox.querySelector('.filter-type')
  const cutoff = filterBox.querySelector('.cutoff')
  const resonance = filterBox.querySelector('.resonance')
  const echoTime = echoBox.querySelector('.echo-time')
  const echoWet = echoBox.querySelector('.echo-wet')
  const echoFeedback = echoBox.querySelector('.echo-feedback')
  const reverbWet = reverbBox.querySelector('.reverb-wet')
  const reverbDecay = reverbBox.querySelector('.reverb-decay')

  // ---------- Звуковая цепочка: синтезатор → фильтр → громкость → колонки ----------
  const gain = new Tone.Gain(0.8).toDestination()

  const reverb = new Tone.Reverb({
    decay: Number(reverbDecay.value),
    wet: Number(reverbWet.value)
  }).connect(gain)

  const echo = new Tone.FeedbackDelay({
    delayTime: 0.3,
    feedback: Number(echoFeedback.value),
    wet: Number(echoWet.value),
    maxDelay: 4
  }).connect(reverb)

  const filter = new Tone.Filter(1800, 'lowpass').connect(echo)
  filter.Q.value = 3
  const synth = new Tone.Synth({
    oscillator: { type: 'triangle' }
  }).connect(filter)

  // сдвиг октавы в полутонах: -12, 0 или +12
  let octaveShift = 0

  // превращаем партитуру в список событий со временем в секундах
  const melody = buildEvents(voiceScore, sections)

  // ---------- Партия с нотами ----------
  const part = new Tone.Part((time, note) => {
    const freq = Tone.Frequency(note.noteName)
      .transpose(octaveShift)
      .toFrequency()
    const length = note.duration / part.playbackRate
    synth.triggerAttackRelease(freq, length, time, note.velocity)
  }, melody)

  // длина всей пьесы в долях: 16 + 32 + 16 = 64
  const totalBeats = sections.reduce((sum, s) => sum + s.bars * 4, 0)

  part.loop = true
  part.loopEnd = totalBeats * SEC_PER_BEAT

  // сразу учитываем текущее положение ползунка темпа
  part.playbackRate = Number(tempo.value) / BASE_BPM

  // Названия шагов из списка → сколько долей мелодии они занимают
  const ECHO_STEPS = { '8n': 0.5, '8n.': 0.75, '4n': 1 }

  // Считаем задержку в секундах так же, как считается мелодия:
  // доли × секунд на долю ÷ скорость воспроизведения.
  // Так эхо не разъезжается с мелодией, когда двигаешь ползунок темпа.
  function updateEchoTime() {
    const beats = ECHO_STEPS[echoTime.value]
    echo.delayTime.value = (beats * SEC_PER_BEAT) / part.playbackRate
  }
  updateEchoTime()

  // ---------- Закрашивание дорожки ползунка белым ----------
  function setFill(slider) {
    const percent =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100
    slider.style.setProperty('--fill', percent + '%')
  }

  // закрашивание всех ползунков этого голоса сразу при загрузке
  ;[box, oscBox, filterBox, echoBox, reverbBox].forEach((block) => {
    block.querySelectorAll('input[type=range]').forEach((slider) => {
      setFill(slider)
      slider.addEventListener('input', () => setFill(slider))
    })
  })

  // ---------- Кнопки ИГРАТЬ / СТОП ----------
  playBtn.addEventListener('click', async () => {
    await Tone.start()
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start()
    }
    part.stop()
    part.start(Tone.Transport.seconds + 0.1)
    playBtn.classList.add('active')
  })

  stopBtn.addEventListener('click', () => {
    part.stop()
    synth.triggerRelease()
    playBtn.classList.remove('active')
  })

  // ---------- Темп и громкость ----------
  tempo.addEventListener('input', () => {
    const bpm = Number(tempo.value)
    box.querySelector('.tempo-value').textContent = bpm + ' bpm'
    part.playbackRate = bpm / BASE_BPM
    updateEchoTime()
  })

  volume.addEventListener('input', () => {
    gain.gain.value = Number(volume.value)
    box.querySelector('.volume-value').textContent = volume.value
  })

  // ---------- Осциллятор ----------
  wave.addEventListener('change', () => {
    synth.oscillator.type = wave.value
  })

  octave.addEventListener('change', () => {
    octaveShift = Number(octave.value)
  })

  detune.addEventListener('input', () => {
    synth.detune.value = Number(detune.value)
    oscBox.querySelector('.detune-value').textContent = detune.value + ' ct'
  })

  // ---------- Фильтр ----------
  filterType.addEventListener('change', () => {
    filter.type = filterType.value
  })

  cutoff.addEventListener('input', () => {
    filter.frequency.value = Number(cutoff.value)
    filterBox.querySelector('.cutoff-value').textContent = cutoff.value + ' Гц'
  })

  resonance.addEventListener('input', () => {
    filter.Q.value = Number(resonance.value)
    filterBox.querySelector('.resonance-value').textContent = resonance.value
  })

  // ---------- Эхо ----------
  echoTime.addEventListener('change', updateEchoTime)

  echoWet.addEventListener('input', () => {
    echo.wet.value = Number(echoWet.value)
    echoBox.querySelector('.echo-wet-value').textContent =
      Math.round(echoWet.value * 100) + '%'
  })

  echoFeedback.addEventListener('input', () => {
    echo.feedback.value = Number(echoFeedback.value)
    echoBox.querySelector('.echo-feedback-value').textContent =
      Math.round(echoFeedback.value * 100) + '%'
  })

  // ---------- Реверберация ----------
  reverbWet.addEventListener('input', () => {
    reverb.wet.value = Number(reverbWet.value)
    reverbBox.querySelector('.reverb-wet-value').textContent =
      Math.round(reverbWet.value * 100) + '%'
  })

  reverbDecay.addEventListener('input', () => {
    reverb.decay = Number(reverbDecay.value) // зал «перестраивается» заново
    reverbBox.querySelector('.reverb-decay-value').textContent =
      reverbDecay.value + ' с'
  })
}

// сборка обоих голосов
createVoice(
  'max',
  'osc-max',
  'filter-max',
  'fx-echo-max',
  'fx-reverb-max',
  SCORE.melodyMax,
  SECTIONS
)
createVoice(
  'chloe',
  'osc-chloe',
  'filter-chloe',
  'fx-echo-chloe',
  'fx-reverb-chloe',
  SCORE.melodyChloe,
  SECTIONS
)
