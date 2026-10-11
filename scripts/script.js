// ============ МЕЛОДИИ ============

// Мелодия Max ("Mt Washington")
const melodyMax = [
  { time: 0.0, noteName: 'E4', duration: '8n', velocity: 1 },
  { time: 0.5, noteName: 'D4', duration: '8n', velocity: 1 },
  { time: 1.0, noteName: 'C4', duration: '8n', velocity: 1 },
  { time: 1.5, noteName: 'A3', duration: '8n', velocity: 1 },
  { time: 2.0, noteName: 'C4', duration: '8n', velocity: 1 },
  { time: 2.5, noteName: 'C4', duration: '4n', velocity: 1 },
  { time: 3.5, noteName: 'A3', duration: '8n', velocity: 1 },
  { time: 4.0, noteName: 'G3', duration: '2n', velocity: 1 }
]

// Мелодия Chloe
const melodyChloe = [
  { time: 0.0, noteName: 'E4', duration: '8n', velocity: 1 },
  { time: 0.5, noteName: 'E4', duration: '8n', velocity: 1 },
  { time: 1.0, noteName: 'D4', duration: '8n', velocity: 1 },
  { time: 1.5, noteName: 'C4', duration: '8n', velocity: 1 },
  { time: 2.0, noteName: 'A3', duration: '4n', velocity: 1 },
  { time: 3.0, noteName: 'A3', duration: '8n', velocity: 1 },
  { time: 3.5, noteName: 'C4', duration: '8n', velocity: 1 },
  { time: 4.0, noteName: 'D4', duration: '8n', velocity: 1 },
  { time: 4.5, noteName: 'C4', duration: '2n', velocity: 1 }
]

// ============ ФУНКЦИЯ, КОТОРАЯ СОБИРАЕТ ОДИН ГОЛОС ============
// sectionId — id блока на странице ('max' или 'chloe'), melody — массив нот.
// Мы пишем код один раз и применяем его к обоим голосам.
function createVoice(sectionId, oscId, filterId, melody) {
  const box = document.getElementById(sectionId) // кнопки, темп, громкость
  const oscBox = document.getElementById(oscId) // карточка осциллятора
  const filterBox = document.getElementById(filterId) // карточка фильтра

  // Находим все элементы управления (по классам из HTML)
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

  // Сдвиг октавы в полутонах: -12, 0 или +12
  let octaveShift = 0

  // Темп, при котором мелодия звучит «как записана»
  const BASE_BPM = 78

  // ---------- Партия с нотами ----------
  const part = new Tone.Part((time, note) => {
    // Переносим ноту на выбранную октаву и узнаём её частоту в герцах
    const freq = Tone.Frequency(note.noteName)
      .transpose(octaveShift)
      .toFrequency()
    // Длину ноты переводим в секунды и подгоняем под текущий темп
    const length = Tone.Time(note.duration).toSeconds() / part.playbackRate
    synth.triggerAttackRelease(freq, length, time, note.velocity)
  }, melody)

  part.loop = true // повторять мелодию
  part.loopEnd = 6 // длина одного круга — 6 секунд

  // ---------- Закрашивание дорожки ползунка белым ----------
  function setFill(slider) {
    const percent =
      ((slider.value - slider.min) / (slider.max - slider.min)) * 100
    slider.style.setProperty('--fill', percent + '%')
  }

  // Закрашиваем все ползунки этого голоса сразу при загрузке
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
    part.start(Tone.Transport.seconds + 0.1) // запускаем партию «прямо сейчас»
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

// Запускаем сборку обоих голосов
createVoice('max', 'osc-max', 'filter-max', melodyMax)
createVoice('chloe', 'osc-chloe', 'filter-chloe', melodyChloe)
