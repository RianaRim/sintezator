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
  let offset = 0 // сколько долей прошло до начала текущего блока

  sections.forEach((section) => {
    const notes = voiceScore[section.id] // ноты этого блока: intro, middle или end

    notes.forEach((n) => {
      events.push({
        time: (offset + n.beat) * SEC_PER_BEAT, // когда играть (в секундах)
        noteName: n.name, // название ноты
        duration: n.len * SEC_PER_BEAT, // сколько звучит (в секундах)
        velocity: n.velocity // громкость ноты (может быть пустой — это нормально)
      })
    })

    offset += section.bars * 4 // сдвигаем начало следующего блока (4 доли в такте)
  })

  return events
}

// ============ ФУНКЦИЯ, КОТОРАЯ СОБИРАЕТ ОДИН ГОЛОС ============
// sectionId — id блока на странице ('max' или 'chloe'), voiceScore — ноты голоса.
function createVoice(sectionId, oscId, filterId, voiceScore, sections) {
  const box = document.getElementById(sectionId) // кнопки, темп, громкость
  const oscBox = document.getElementById(oscId) // карточка осциллятора
  const filterBox = document.getElementById(filterId) // карточка фильтра

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

  // ---------- Звуковая цепочка: синтезатор → фильтр → громкость → колонки ----------
  const gain = new Tone.Gain(0.8).toDestination() // громкость (0–1)
  const filter = new Tone.Filter(1800, 'lowpass').connect(gain) // фильтр
  filter.Q.value = 3 // резонанс
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
    const length = note.duration / part.playbackRate // при быстром темпе ноты короче
    synth.triggerAttackRelease(freq, length, time, note.velocity)
  }, melody)

  // длина всей пьесы в долях: 16 + 32 + 16 = 64
  const totalBeats = sections.reduce((sum, s) => sum + s.bars * 4, 0)

  part.loop = true // повторять мелодию
  part.loopEnd = totalBeats * SEC_PER_BEAT // один круг = вся пьеса целиком

  // сразу учитываем текущее положение ползунка темпа
  part.playbackRate = Number(tempo.value) / BASE_BPM

  // ---------- Закрашивание дорожки ползунка белым ----------
  function setFill(slider) {
    const percent =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100
    slider.style.setProperty('--fill', percent + '%')
  }

  // закрашивание всех ползунков этого голоса сразу при загрузке
  ;[box, oscBox, filterBox].forEach((block) => {
    block.querySelectorAll('input[type=range]').forEach((slider) => {
      setFill(slider)
      slider.addEventListener('input', () => setFill(slider))
    })
  })

  // ---------- Кнопки ИГРАТЬ / СТОП ----------
  playBtn.addEventListener('click', async () => {
    await Tone.start() // браузер разрешает звук только после клика
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start() // общие часы Tone.js
    }
    part.stop() // на случай, если уже играет — начнём с начала
    part.start(Tone.Transport.seconds + 0.1)
    playBtn.classList.add('active')
  })

  stopBtn.addEventListener('click', () => {
    part.stop() // останавливаем ноты
    synth.triggerRelease() // глушим ноту, которая ещё звучит
    playBtn.classList.remove('active')
  })

  // ---------- Темп и громкость ----------
  tempo.addEventListener('input', () => {
    const bpm = Number(tempo.value)
    box.querySelector('.tempo-value').textContent = bpm + ' bpm'
    part.playbackRate = bpm / BASE_BPM // 78 bpm = обычная скорость
  })

  volume.addEventListener('input', () => {
    gain.gain.value = Number(volume.value)
    box.querySelector('.volume-value').textContent = volume.value
  })

  // ---------- Осциллятор ----------
  wave.addEventListener('change', () => {
    synth.oscillator.type = wave.value // sine, triangle, square, sawtooth
  })

  octave.addEventListener('change', () => {
    octaveShift = Number(octave.value) // применится к следующим нотам
  })

  detune.addEventListener('input', () => {
    synth.detune.value = Number(detune.value)
    oscBox.querySelector('.detune-value').textContent = detune.value + ' ct'
  })

  // ---------- Фильтр ----------
  filterType.addEventListener('change', () => {
    filter.type = filterType.value // lowpass, highpass, bandpass
  })

  cutoff.addEventListener('input', () => {
    filter.frequency.value = Number(cutoff.value)
    filterBox.querySelector('.cutoff-value').textContent = cutoff.value + ' Гц'
  })

  resonance.addEventListener('input', () => {
    filter.Q.value = Number(resonance.value)
    filterBox.querySelector('.resonance-value').textContent = resonance.value
  })
}

// сборка обоих голосов
createVoice('max', 'osc-max', 'filter-max', SCORE.melodyMax, SECTIONS)
createVoice('chloe', 'osc-chloe', 'filter-chloe', SCORE.melodyChloe, SECTIONS)
