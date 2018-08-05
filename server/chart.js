module.exports = class {
  constructor (config) {
    this.config = config
    this.values = []
    this.legend = []
    this.setup()
  }

  setup () {
    // setup values
    for (let i = 0; i < this.config.bars.length; i++) {
      if (!this.values[i]) {
        this.values[i] = []
      }
      for (let j = 0; j < this.config.bars[i].content[0].card.length; j++) {
        this.values[i][j] = 0
      }
    }

    // setup legend
    for (let i = 0; i < this.config.bars.length; i++) {
      if (!this.legend[i]) {
        this.legend[i] = []
      }
      for (let j = 0; j < this.config.bars[i].content[0].card.length; j++) {
        this.legend[i][j] = this.config.bars[i].content[0].card[j].value
      }
    }
  }

  add (values) {
    for (let i = 0; i < values.length; i++) {
      let j = this.legend[i].indexOf(values[i])
      this.values[i][j] += 1
    }
  }

  reset () {
    this.values = []
    this.legend = []
    this.setup()
  }
}

