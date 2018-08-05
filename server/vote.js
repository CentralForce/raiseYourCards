module.exports = class {
  constructor (length) {
    this.length = length
    this.array = []
  }

  reset () {
    this.array = []
  }

  add (name, values) {
    this.array.push({
      name: name,
      values: values
    })
  }

  isAllowed (name, data) {
    return (data.length === this.length && name.length !== 0)
  }
}

