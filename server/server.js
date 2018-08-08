// #region - modules
const express = require('express')
const socket = require('socket.io')
const path = require('path')
// #endregion

// #region - local javascript files
const config = require('./config.js')
const Vote = require('./vote.js')
const Chart = require('./chart.js')
// #endregion

// const
const app = express()
const port = 6660
const vote = new Vote(config.sections.length)
const chart = new Chart(config)
const server = app.listen(port, () => console.log(`Server started on port ${port}`))
const io = socket(server)

app.use(express.static(path.join(__dirname, '../client/public')))

// #region - API
app.get('/api/config', (req, res) => {
  res.json(config)
})

app.get('/api/votes', (req, res) => {
  res.json(vote.array)
})

app.get('/api/charts', (req, res) => {
  res.json(chart.values)
})
// #endregion

io.on('connection', function (socket) {
  console.log('Connected: ', socket.id)

  socket.on('disconnect', function () {
    console.log('Disconnected: ', socket.id)
  })

  socket.on('vote', function (data) {
    console.log('Received vote from ', data.name)
    if (vote.isAllowed(data.name, data.values)) {
      vote.add(data.name, data.values)
      chart.add(data.values)
      io.emit('voted', data.name)
    }
  })

  socket.on("reset", function(data) {
    console.log("Reset from ", data.name)
    chart.reset()
    vote.reset()
    io.emit('reseted', data.name)
  })
})


