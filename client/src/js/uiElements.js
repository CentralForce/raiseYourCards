import {Chart} from 'chart.js'

export class UIElements {
  generateCard (text, width, height, bgColor, fontColor) {
    let card = document.createElement('div')
    card.classList.add('card')
    card.innerHTML = text
    card.style.backgroundColor = bgColor
    card.style.color = fontColor
    card.style.width = width
    card.style.height = height
    card.addEventListener('click', function () {
      for (let cards of card.parentNode.getElementsByClassName('card')) {
        cards.classList.remove('active')
      }
      card.classList.add('active')
    })
    return card
  }

  generateSubmit (text, width, height, bgColor, fontColor) {
    let submit = document.createElement('div')
    submit.classList.add('submit', 'button')
    submit.innerHTML = text
    submit.style.backgroundColor = bgColor
    submit.style.color = fontColor
    submit.style.width = width
    submit.style.height = height
    return submit
  }

  generateChart (labels, bgColors, canvas, content) {
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

