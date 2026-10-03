document.addEventListener('DOMContentLoaded')

// =====================================================
// 1. НАСТРОЙКИ. Все ручки хранятся в одном объекте P.
// =====================================================
const P = {
  bpm: 90,
  volume: 0.8,
  wave: 'triangle',
  octave: 0,
  detune: 0,
  ftype: 'lowpass',
  cutoff: 1800,
  res: 3,
  gain: 0.5,
  attack: 0.02,
  release: 0.5,
  delay: 0.25,
  reverb: 0.35
}

// Ноты — числа MIDI (пентатоника ля минор: звучит красиво при любом порядке)
const NOTES = [57, 60, 62, 64, 67, 69, 72, 74]
const NOTE_NAMES = ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5']
const NOTE_KEYS = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k']
const DRUMS = [
  ['kick', 'Бочка'],
  ['snare', 'Снейр'],
  ['rim', 'Римшот'],
  ['hat', 'Хэт'],
  ['open', 'Откр. хэт'],
  ['tom', 'Том']
]
const DRUM_KEYS = ['z', 'x', 'c', 'v', 'b', 'n']

// =====================================================
// 2. ЗВУКОВАЯ ЦЕПОЧКА (Web Audio)
// Осциллятор -> Фильтр -> Усилитель -> шина -> эффекты -> выход
// =====================================================
let ctx, master, synthBus, drumBus, delayNode, delayWet, reverbWet, noiseBuf
const samples = {} // сюда попадают загруженные файлы

function initAudio() {
  if (ctx) {
    ctx.resume()
    return
  }
  ctx = new (window.AudioContext || window.webkitAudioContext)()

  master = ctx.createGain()
  master.gain.value = P.volume
  const comp = ctx.createDynamicsCompressor() // чтобы звук не "хрипел"
  master.connect(comp)
  comp.connect(ctx.destination)

  synthBus = ctx.createGain()
  synthBus.connect(master) // мелодия
  drumBus = ctx.createGain()
  drumBus.connect(master) // ударные

  // Эхо (delay): сигнал идёт по кругу и затухает
  delayNode = ctx.createDelay(1)
  const feedback = ctx.createGain()
  feedback.gain.value = 0.4
  delayWet = ctx.createGain()
  delayWet.gain.value = P.delay
  synthBus.connect(delayNode)
  delayNode.connect(feedback)
  feedback.connect(delayNode)
  delayNode.connect(delayWet)
  delayWet.connect(master)

  // Реверберация: "комната" из затухающего шума
  const conv = ctx.createConvolver()
  const len = ctx.sampleRate * 2.5
  const imp = ctx.createBuffer(2, len, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const d = imp.getChannelData(c)
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5)
  }
  conv.buffer = imp
  reverbWet = ctx.createGain()
  reverbWet.gain.value = P.reverb
  synthBus.connect(conv)
  conv.connect(reverbWet)
  reverbWet.connect(master)

  // Белый шум — основа для снейра и хэтов
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
  const nd = noiseBuf.getChannelData(0)
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

  updateDelayTime()
}

function updateDelayTime() {
  if (delayNode) delayNode.delayTime.value = (60 / P.bpm) * 0.75 // пунктирная восьмая
}

// Играет одну ноту. time — когда начать, dur — сколько держать
function playNote(i, time = ctx.currentTime, dur = 0.25) {
  const freq = 440 * Math.pow(2, (NOTES[i] + 12 * P.octave - 69) / 12)

  const osc = ctx.createOscillator() // ОСЦИЛЛЯТОР
  osc.type = P.wave
  osc.frequency.value = freq
  osc.detune.value = P.detune

  const filter = ctx.createBiquadFilter() // ФИЛЬТР
  filter.type = P.ftype
  filter.frequency.value = P.cutoff
  filter.Q.value = P.res

  const amp = ctx.createGain() // УСИЛИТЕЛЬ (огибающая громкости)
  const hold = Math.max(dur, P.attack)
  amp.gain.setValueAtTime(0.0001, time)
  amp.gain.linearRampToValueAtTime(P.gain, time + P.attack) // нарастание
  amp.gain.setValueAtTime(P.gain, time + hold) // удержание
  amp.gain.exponentialRampToValueAtTime(0.0001, time + hold + P.release) // затухание

  osc.connect(filter)
  filter.connect(amp)
  amp.connect(synthBus)
  osc.start(time)
  osc.stop(time + hold + P.release + 0.05)
}

// ---------- Ударные (синтез в духе KR-55) ----------
function tone(t, f0, f1, len, vol, type = 'sine') {
  const o = ctx.createOscillator(),
    g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(f0, t)
  o.frequency.exponentialRampToValueAtTime(f1, t + len) // высота "падает"
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + len)
  o.connect(g)
  g.connect(drumBus)
  o.start(t)
  o.stop(t + len)
}
function noise(t, len, type, freq, vol) {
  const s = ctx.createBufferSource(),
    f = ctx.createBiquadFilter(),
    g = ctx.createGain()
  s.buffer = noiseBuf
  f.type = type
  f.frequency.value = freq
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.001, t + len)
  s.connect(f)
  f.connect(g)
  g.connect(drumBus)
  s.start(t)
  s.stop(t + len)
}
function playDrum(id, t = ctx.currentTime) {
  if (samples[id]) {
    // если загружен свой файл — играем его
    const s = ctx.createBufferSource()
    s.buffer = samples[id]
    s.connect(drumBus)
    s.start(t)
    return
  }
  if (id === 'kick') tone(t, 140, 45, 0.35, 1)
  if (id === 'snare') {
    noise(t, 0.2, 'highpass', 1500, 0.7)
    tone(t, 220, 120, 0.1, 0.5, 'triangle')
  }
  if (id === 'rim') {
    tone(t, 900, 700, 0.04, 0.4, 'square')
    noise(t, 0.04, 'bandpass', 2500, 0.3)
  }
  if (id === 'hat') noise(t, 0.05, 'highpass', 7500, 0.35)
  if (id === 'open') noise(t, 0.3, 'highpass', 7000, 0.3)
  if (id === 'tom') tone(t, 220, 90, 0.3, 0.8)
}

// =====================================================
// 3. РИСУЕМ ПОЛЗУНКИ И СПИСКИ (чтобы не писать HTML руками)
// =====================================================
const controls = {} // здесь храним ручки, чтобы пресеты могли их двигать

function addSlider(parent, key, label, min, max, step, unit = '') {
  const row = document.createElement('label')
  row.className = 'slider'
  row.innerHTML = `<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${P[key]}"><output></output>`
  const input = row.querySelector('input'),
    out = row.querySelector('output')
  const show = () => (out.textContent = input.value + unit)
  input.addEventListener('input', () => {
    setParam(key, +input.value)
    show()
  })
  controls[key] = { input, show }
  show()
  parent.appendChild(row)
}

function addSelect(parent, key, label, options) {
  const row = document.createElement('label')
  row.className = 'select'
  row.innerHTML = `<span>${label}</span><select></select>`
  const select = row.querySelector('select')
  options.forEach(([v, text]) => select.add(new Option(text, v)))
  select.value = P[key]
  select.addEventListener('change', () =>
    setParam(key, isNaN(select.value) ? select.value : +select.value)
  )
  controls[key] = { input: select, show() {} }
  parent.appendChild(row)
}

// Меняет настройку и, если надо, сразу обновляет звук
function setParam(key, v) {
  P[key] = v
  if (!ctx) return
  if (key === 'volume') master.gain.value = v
  if (key === 'delay') delayWet.gain.value = v
  if (key === 'reverb') reverbWet.gain.value = v
  if (key === 'bpm') updateDelayTime()
}
// Двигает ручку программно (нужно для пресетов)
function setControl(key, v) {
  controls[key].input.value = v
  controls[key].show()
  setParam(key, v)
}

const $ = (id) => document.getElementById(id)

addSlider($('panelSliders'), 'bpm', 'Темп', 60, 160, 1, ' bpm')
addSlider($('panelSliders'), 'volume', 'Громкость', 0, 1, 0.01)

addSelect($('osc'), 'wave', 'Форма волны', [
  ['sine', 'Синус'],
  ['triangle', 'Треугольник'],
  ['square', 'Квадрат'],
  ['sawtooth', 'Пила']
])
addSelect($('osc'), 'octave', 'Октава', [
  [-1, 'Ниже'],
  [0, 'Обычная'],
  [1, 'Выше']
])
addSlider($('osc'), 'detune', 'Расстройка', -100, 100, 1, ' ct')

addSelect($('filter'), 'ftype', 'Тип', [
  ['lowpass', 'Срез верха'],
  ['highpass', 'Срез низа'],
  ['bandpass', 'Полоса']
])
addSlider($('filter'), 'cutoff', 'Частота', 100, 8000, 10, ' Гц')
addSlider($('filter'), 'res', 'Резонанс', 0.1, 15, 0.1)

addSlider($('amp'), 'gain', 'Громкость ноты', 0.05, 1, 0.01)
addSlider($('amp'), 'attack', 'Нарастание', 0.005, 1, 0.005, ' с')
addSlider($('amp'), 'release', 'Затухание', 0.05, 3, 0.05, ' с')

addSlider($('fx'), 'delay', 'Эхо', 0, 0.9, 0.01)
addSlider($('fx'), 'reverb', 'Реверберация', 0, 1.5, 0.01)

// =====================================================
// 4. КНОПКИ-ЗВУКИ
// =====================================================
function flash(btn) {
  btn.classList.add('hit')
  setTimeout(() => btn.classList.remove('hit'), 120)
}
const padByKey = {} // клавиша -> кнопка

NOTES.forEach((_, i) => {
  const b = document.createElement('button')
  b.className = 'pad'
  b.innerHTML = `${NOTE_NAMES[i]}<small>${NOTE_KEYS[i].toUpperCase()}</small>`
  b.onclick = () => {
    initAudio()
    playNote(i)
    flash(b)
  }
  $('notePads').appendChild(b)
  padByKey[NOTE_KEYS[i]] = b
})
DRUMS.forEach(([id, name], i) => {
  const b = document.createElement('button')
  b.className = 'pad drum'
  b.innerHTML = `${name}<small>${DRUM_KEYS[i].toUpperCase()}</small>`
  b.onclick = () => {
    initAudio()
    playDrum(id)
    flash(b)
  }
  $('drumPads').appendChild(b)
  padByKey[DRUM_KEYS[i]] = b
})
document.addEventListener('keydown', (e) => {
  if (e.repeat || e.target.tagName === 'SELECT') return
  const b = padByKey[e.key.toLowerCase()]
  if (b) b.click()
})

// Загрузка своих сэмплов
DRUMS.forEach(([id, name]) => {
  const l = document.createElement('label')
  l.className = 'file'
  l.innerHTML = `<span>${name}</span><b>выбрать файл</b><input type="file" accept="audio/*">`
  l.querySelector('input').onchange = async (e) => {
    initAudio()
    const data = await e.target.files[0].arrayBuffer()
    samples[id] = await ctx.decodeAudioData(data)
    l.classList.add('loaded')
    l.querySelector('b').textContent = e.target.files[0].name
  }
  $('files').appendChild(l)
})

// =====================================================
// 5. СЕКВЕНСОР: 16 шагов, 8 нот + 6 ударных
// =====================================================
const grid = {} // grid["kick"][3] === true, если на шаге 3 играет бочка
const cells = {} // сами кнопки-клетки
const dots = [] // индикатор текущего шага

const stepRow = document.createElement('div')
stepRow.className = 'seq-row'
stepRow.innerHTML = '<span></span>'
for (let s = 0; s < 16; s++) {
  const d = document.createElement('div')
  d.className = 'dot'
  stepRow.appendChild(d)
  dots.push(d)
}
$('seq').appendChild(stepRow)

// Сверху высокие ноты, снизу ударные
const rows = []
for (let i = NOTES.length - 1; i >= 0; i--)
  rows.push({ id: 'n' + i, label: NOTE_NAMES[i], drum: false })
DRUMS.forEach(([id, name]) => rows.push({ id, label: name, drum: true }))

rows.forEach((r) => {
  grid[r.id] = Array(16).fill(false)
  cells[r.id] = []
  const row = document.createElement('div')
  row.className = 'seq-row'
  row.innerHTML = `<span>${r.label}</span>`
  for (let s = 0; s < 16; s++) {
    const c = document.createElement('button')
    c.className =
      'cell' + (r.drum ? ' drum' : '') + (Math.floor(s / 4) % 2 ? '' : ' beat')
    c.setAttribute('aria-label', r.label + ', шаг ' + (s + 1))
    c.onclick = () => {
      grid[r.id][s] = !grid[r.id][s]
      c.classList.toggle('on', grid[r.id][s])
    }
    row.appendChild(c)
    cells[r.id].push(c)
  }
  $('seq').appendChild(row)
})

function setPattern(id, steps) {
  grid[id].fill(false)
  cells[id].forEach((c) => c.classList.remove('on'))
  steps.forEach((s) => {
    grid[id][s] = true
    cells[id][s].classList.add('on')
  })
}

// ---------- Таймер секвенсора ----------
let playing = false,
  step = 0,
  nextTime = 0,
  timer = null

function scheduleStep(s, t) {
  DRUMS.forEach(([id]) => {
    if (grid[id][s]) playDrum(id, t)
  })
  NOTES.forEach((_, i) => {
    if (grid['n' + i][s]) playNote(i, t, (60 / P.bpm / 4) * 0.9)
  })
  setTimeout(
    () => dots.forEach((d, i) => d.classList.toggle('now', i === s)),
    Math.max(0, (t - ctx.currentTime) * 1000)
  )
}
function tick() {
  // Планируем звуки чуть вперёд — так ритм идёт ровно
  while (nextTime < ctx.currentTime + 0.12) {
    scheduleStep(step, nextTime)
    nextTime += 60 / P.bpm / 4 // один шаг = 1/16 такта
    step = (step + 1) % 16
  }
}
$('play').onclick = () => {
  initAudio()
  if (playing) return
  playing = true
  step = 0
  nextTime = ctx.currentTime + 0.05
  timer = setInterval(tick, 25)
}
$('stop').onclick = () => {
  playing = false
  clearInterval(timer)
  dots.forEach((d) => d.classList.remove('now'))
}
$('clear').onclick = () => rows.forEach((r) => setPattern(r.id, []))

// =====================================================
// 6. ПРЕСЕТЫ — три настроения. Мелодии оригинальные:
// их можно переписать на слух под песни из игры.
// =====================================================
const PRESETS = {
  'Тихий вечер': {
    p: {
      bpm: 78,
      wave: 'triangle',
      octave: 0,
      cutoff: 1800,
      res: 3,
      attack: 0.04,
      release: 0.8,
      delay: 0.35,
      reverb: 0.6
    },
    steps: {
      kick: [0, 8, 11],
      snare: [4, 12],
      hat: [2, 6, 10, 14],
      n5: [0],
      n3: [3, 11],
      n4: [6],
      n2: [8],
      n1: [14]
    }
  },
  'Дождь над бухтой': {
    p: {
      bpm: 92,
      wave: 'sawtooth',
      octave: 0,
      cutoff: 900,
      res: 1,
      attack: 0.08,
      release: 1.2,
      delay: 0.45,
      reverb: 0.9
    },
    steps: {
      kick: [0, 10],
      snare: [4, 12],
      rim: [7, 15],
      open: [14],
      hat: [0, 2, 4, 6, 8, 10, 12],
      n4: [0, 6],
      n3: [3, 8],
      n2: [11],
      n5: [14]
    }
  },
  'Ночная дорога': {
    p: {
      bpm: 108,
      wave: 'square',
      octave: 0,
      cutoff: 2600,
      res: 4,
      attack: 0.01,
      release: 0.3,
      delay: 0.3,
      reverb: 0.25
    },
    steps: {
      kick: [0, 4, 8, 12],
      snare: [4, 12],
      hat: [2, 6, 10, 14],
      tom: [15],
      n1: [0, 2, 8, 10],
      n3: [4, 12],
      n0: [6, 14]
    }
  }
}
Object.keys(PRESETS).forEach((name) => $('preset').add(new Option(name, name)))

function applyPreset(name) {
  const pr = PRESETS[name]
  Object.entries(pr.p).forEach(([k, v]) => setControl(k, v))
  rows.forEach((r) => setPattern(r.id, pr.steps[r.id] || []))
}
$('preset').onchange = (e) => applyPreset(e.target.value)
applyPreset('Тихий вечер') // стартовый пресет
