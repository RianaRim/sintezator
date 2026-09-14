console.log('Привет!')

// переменные
const Someconst = 'Const text 1'
let someVar = 'Var text'

let a = 5
let b = 10
let c = a + b

console.log(c)

// список со строковыми литтералами/композитный тип данных/массив (в них можно положить всё)/ счёт начинается от 0
const someArray = ['A', 'B', 'C', 1, 2, 3, Someconst, someVar, c]

// объект (мы сами даём названния данных/ключ: 'значение')
const someObject = { firstName: 'Riana', lastName: 'Rim', data: 1 }

console.log(someArray)
console.log(someObject)

// someArray = [] (когда const то выдаст ошибку, а let не выдаёт)
someArray.push('new element')
someObject.secondName = 'Valery'
console.log(someArray)
console.log(someObject)
// константу можно менять при добавлении в неё элемента, они мутабельны

// вывод для каждого элемента
someArray.forEach((e) => {
  console.log(e)
  logElement1(e)
})

// для объекта своя строка
Object.values(someObject).forEach((e) => {
  console.log(e)
  logElement1(e)
})

function logElement1(e) {
  if (e == 1) {
    console.log('e is 1')
  }
}

// предзакгрузка события/слушатель события
document.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('div')
  button.innerText = 'Button Text'
  button.classList.add('button')

  //   button.style.backgroundColor = '#00ff95'
  //   button.style.padding = '10px'
  //   button.style.width = '100px'
  //   button.style.textAlign = 'center'
  //   button.style.cursor = 'pointer'

  document.body.appendChild(button)

  button.addEventListener('click', () => {
    console.log('click')
  })
})
