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

socket.on('voted', function (name) {
  console.log('Received vote from ', name)
  updateCharts()
})

socket.on("reseted", function (name) {
  console.log("Received reset from", name)
  updateCharts()
})

function votePage () {
  let pageElement = uiElements.page()

  // create card sections
  for (let section of config.sections) {
    let sectionElement = document.createElement('div')
    sectionElement.classList.add('section')
    pageElement.appendChild(sectionElement)
    for (let content of section.content) {
      for (let card of content.card) {
        let cardElement = uiElements.card(card.text)
        cardElement.addEventListener('click', function () {
          section.value = card.value
        })
        for (let classes of card.class) {
          cardElement.classList.add(classes)
        }
        sectionElement.appendChild(cardElement)
      }
    }
  }

  // create submit button
  {
    let submitElement = uiElements.button("Submit", ["submit", "custom-submit"])
    let sections = config.sections
    submitElement.addEventListener('click', function () {
      // send values
      {
        let values = []
        for (let section of sections) {
          if (!isNaN(section.value)) {
            values[values.length] = section.value
          }
        }

        socket.emit('vote', {
          name: name,
          values: values
        })
      }

      // change page
      clearApp()
      app.appendChild(resultPage())
      
    })
    pageElement.appendChild(submitElement)
  }

  return pageElement
}

function resultPage () {
  chartIndex = []
  
  let pageElement = uiElements.page()

    let chartValues
    fetch('/api/charts', {mode: 'same-origin'})
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        chartValues = json
      })
      .then(function () {
        for (let i = 0; i < config.sections.length; i++) {

          let sections = config.sections[i]

          // reconstuct cards
          let cardCollection = []
          for (let content of sections.content) {
            for (let card of content.card) {
              let cardElement = uiElements.card(card.text)
              for (let classes of card.class) {
                cardElement.classList.add(classes)
              }
              cardCollection.push(cardElement)
            }
          }

          // collect attributs
          let labels = []
          let color = []
          for (let card of cardCollection) {
            labels.push(card.innerHTML)
            color.push(window.getComputedStyle(card).backgroundColor)
          }

          // create canvas
          let canvas = document.createElement('canvas')
          canvas.setAttribute('width', 300)
          canvas.setAttribute('height', 300)
          canvas.classList.add('chart')
          pageElement.appendChild(canvas)

          chartIndex[chartIndex.length] = uiElements.chart(labels, color, canvas, chartValues[i])
        }
      })
      .catch(function (error) {
        console.log(error)
      })

  let resetElement = uiElements.button("Reset", ["reset", "custom-reset"])
      pageElement.appendChild(resetElement)
      resetElement.addEventListener('click', function () {
        // send reset
        socket.emit('reset', {
          name: name
        })
  
        // change page
        clearApp()
        app.appendChild(votePage())
      })

  return pageElement
}

function clearApp() {
  for (let node of app.childNodes) {
    node.remove()
  }
}

function updateCharts() {
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
}
