// CSS
import general from './css/general.css'

// Javascript
import { UIElements } from './js/uiElements'

// Module imports
import io from 'socket.io-client'

// Constances
const server = window.location.href
const uiElements = new UIElements()
const socket = io(server)
const app = document.getElementById('app')
const name = 'Name'
let chartIndex = []

// Receive configuration from server
let config = {}
fetch('/api/config', {mode: 'same-origin'})
  .then(function (response) {
    return response.json()
  })
  .then(function (json) {
    config = json
  })
  .then(function () {
    app.appendChild(votePage())
  })
  .catch(function (error) {
    console.log(error)
  })

// Process vote
socket.on('voted', function (name) {
  console.log('Received vote from ', name)

  // update charts
  if (chartIndex.length > 0) {
    let chartValues
    fetch('/api/charts', {mode: 'same-origin'})
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        chartValues = json
      })
      .catch(function (error) {
        console.log(error)
      }).then(function () {
        for (let i = 0; i < chartIndex.length; i++) {
          let chart = chartIndex[i]
          chart.data.datasets[0].data = chartValues[i]
          chart.update()
        }
      })
  }
})

function votePage () {
  let pageElement = document.createElement('div')
  pageElement.classList.add('page')

  // setup cards
  for (let bar of config.bars) {
    let barElement = document.createElement('div')
    barElement.classList.add('bar')
    pageElement.appendChild(barElement)

    for (let content of bar.content) {
      for (let card of content.card) {
        let cardElement = uiElements.generateCard(
          card.text,
          card.style.width,
          card.style.height,
          card.style.bgColor,
          card.style.fontColor
        )
        cardElement.addEventListener('click', function () {
          bar.value = card.value
        })
        barElement.appendChild(cardElement)
      }
    }
  }

  // setup button
  {
    let submit = config.submit[0]
    let submitElement = uiElements.generateSubmit(
      submit.text,
      submit.style.width,
      submit.style.height,
      submit.style.bgColor,
      submit.style.fontColor
    )

    let bars = config.bars
    submitElement.addEventListener('click', function () {
      // send values
      {
        let values = []
        for (let bar of bars) {
          if (!isNaN(bar.value)) {
            values[values.length] = bar.value
          } else {
            // Error-Message
            return
          }
        }

        socket.emit('vote', {
          name: name,
          values: values
        })
      }

      // change page
      {
        let app = document.getElementById('app')
        for (let node of app.childNodes) {
          node.remove()
        }
        app.appendChild(resultPage())
      }
    })
    pageElement.appendChild(submitElement)
  }

  return pageElement
}

function resultPage () {
  let pageElement = document.createElement('div')
  pageElement.classList.add('page')

  for (let i = 0; i < config.bars.length; i++) {
    let bar = config.bars[i]

    let canvas = document.createElement('canvas')
    canvas.setAttribute('width', 300)
    canvas.setAttribute('height', 300)
    canvas.classList.add('chart')
    pageElement.appendChild(canvas)

    // get attributs
    let labels = []
    let color = []
    for (let content of bar.content) {
      for (let card of content.card) {
        labels[labels.length] = card.text
        color[color.length] = card.style.bgColor + '55'
      }
    }

    let chartValues
    fetch('/api/charts', {mode: 'same-origin'})
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        chartValues = json
      })
      .catch(function (error) {
        console.log(error)
      }).then(function () {
        chartIndex[chartIndex.length] = uiElements.generateChart(labels, color, canvas, chartValues[i])
      })
  }

  return pageElement
}

