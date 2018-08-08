import {Chart} from 'chart.js'

export class UIElements {
  card (text) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = text
    card.addEventListener('click', function () {
      for (let cards of card.parentNode.getElementsByClassName('card')) {
        cards.classList.remove('active')
      }
      card.classList.add('active')
    })
    return card
  }

  button (text, classes) {
    let submit = document.createElement('div')
    submit.innerHTML = text
    submit.classList.add('button')
    for (let c of classes) {
      submit.classList.add(c)
    }
    return submit
  }

  page() {
    let pageElement = document.createElement('div')
    pageElement.classList.add('page')
    return pageElement
  }

  chart (labels, bgColors, canvas, content) {
    let data = {
      labels: labels,
      datasets: [{
        data: content,
        backgroundColor: bgColors,
        borderColor: bgColors,
        borderWidth: 2
      }]
    }

    let options = {
      responsive: false,
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#e1e1e1',
            suggestedMin: 0,
            beginAtZero: true,
            stepSize: 1
          },
          gridLines: {
            color: '#e1e1e133',
            lineWidth: 1
          }
        }],
        xAxes: [{
          ticks: {
            fontColor: '#e1e1e1'
          },
          gridLines: {
            color: '#e1e1e100',
            lineWidth: 1
          }
        }]
      }
    }

    let chart = new Chart(canvas, {
      type: 'bar',
      data: data,
      options: options
    })

    return chart
  }
}


