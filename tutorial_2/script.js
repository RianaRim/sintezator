console.log('Привет!')

// Создаём аудио-контекст для воспроизведения звука
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

// Создаём осциллятор внутри аудио-контекста
const oscillator = audioCtx.createOscillator()

function createButton() {
  const button = document.createElement('div')
  button.innerText = 'Start'
  button.classList.add('button')
  document.body.appendChild(button)

  button.addEventListener('click', () => {
    createOscillator()
  })
}

function createSlider() {
  const frequency = 440

  const valueElement = document.createElement('div')
  valueElement.innerText = frequency
  document.body.appendChild(valueElement)

  const slider = document.createElement('input')
  slider.type = 'range'
  slider.min = 0
  slider.max = 1000
  slider.step = 1
  slider.value = frequency
  document.body.appendChild(slider)

  slider.addEventListener('input', (event) => {
    // console.log('input', event.target.value)

    valueElement.innerText = event.target.value

    oscillator.frequency.setValueAtTime(
      event.target.value,
      audioCtx.currentTime
    )
  })
}

function createOscillator() {
  // Задаём осциллятору тип волны
  oscillator.type = 'square'

  // Задаём осциллятору частоту в герцах
  oscillator.frequency.setValueAtTime(440, audioCtx.currentTime)

  // Подключаем осциллятор к выводу звука (нашим колонкам)
  oscillator.connect(audioCtx.destination)

  // Запускаем осциллятор
  oscillator.start()
}

document.addEventListener('DOMContentLoaded', () => {
  createButton()
  createSlider()
})
