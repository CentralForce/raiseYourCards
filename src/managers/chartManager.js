const _ = require("lodash");

module.exports = class {
  generateCharts(preset, votes) {
    // Chart
    let chartCollection = [];
    preset.rows.forEach((row, i) => {
      let votesCollection = _.fill(Array(row.cards.length), 0);
      let labelsCollection = _.fill(Array(row.cards.length), "");

      row.cards.forEach((card, j) => {
        labelsCollection[j] = card.name;
      });

      votes.forEach((vote, j) => {
        let rowvote = vote.vote[i];
        row.cards.forEach((card, k) => {
          if (_.isEqual(card.value, rowvote)) {
            votesCollection[k] += 1;
          }
        });
      });

      chartCollection[chartCollection.length] = {
        type: "bar",
        data: {
          labels: labelsCollection,
          datasets: [
            {
              label: "Votes",
              data: votesCollection,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              borderColor: "rgba(255,255,255,1)",
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          scales: {
            xAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 1
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  stepSize: 1
                }
              }
            ]
          }
        }
      };
    });

    // Average
    let averageCollection = [];
    preset.rows.forEach((row, i) => {
      let sum = 0;
      if (_.has(row, "average") && row.average == true && votes.length > 0) {
        votes.forEach((vote, j) => {
          sum += vote.vote[i];
        });
        averageCollection[i] = sum / votes.length;
      } else {
        averageCollection[i] = null;
      }
    });

    return {
      charts: chartCollection,
      average: averageCollection
    };
  }
};

