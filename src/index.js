const serverSettings = require("./settings/serverSettings");
const presets = require("./settings/presets");

const express = require("express");
const socket = require("socket.io");
const path = require("path");
const _ = require("lodash");

const app = express();
const port = serverSettings.port;

const server = app.listen(port, () =>
  console.log("Node | Server started | Listening on port: ", port)
);

const Users = require("./managers/userManager");
const users = new Users();

const Rooms = require("./managers/roomManager");
const rooms = new Rooms();

const Charts = require("./managers/chartManager");
const charts = new Charts();

app.use(express.static(path.join(__dirname, "../static")));
const io = socket(server);

io.sockets.on("connection", socket => {
  console.log("Socket.io | Client connected | ID: ", socket.id);
  socket.emit("server_confirms_connection");

  socket.on("disconnect", () => {
    users.removeUser(socket.id);
    rooms.removeUserEverywhere(socket.id);
    console.log("Socket.io | Client disconnected | ID: ", socket.id);
  });

  socket.on("client_requests_roomlist", () => {
    console.log("Socket.io | Client requests room list | ID: ", socket.id);
    socket.emit("server_sends_roomlist", rooms.getRooms());
  });

  socket.on("client_requests_create", data => {
    if (
      _.has(data, "roomname") &&
      _.isString(data.roomname) &&
      data.roomname.length > 0 &&
      _.has(data, "preset") &&
      _.isNumber(data.preset) &&
      data.preset >= 0 &&
      _.has(data, "anonym") &&
      _.isBoolean(data.anonym) &&
      _.isNull(rooms.getRoom(data.roomname))
    ) {
      rooms.createRoom(data.roomname, data.preset, data.anonym);
      console.log(
        "Node | Client requests room creation | Roomname: ",
        data.roomname
      );
      socket.emit("server_confirms_created", { roomname: data.roomname });
      io.sockets.emit("server_sends_roomlist", rooms.getRooms());
    } else if (!_.isNull(rooms.getRoom(data.roomname))) {
      console.log("Node | Client requests room creation | Name already exists");
    } else {
      console.log("Node | Client requests room creation | Request is invalid");
    }
  });

  socket.on("client_requests_presets", () => {
    socket.emit("server_sends_presets", { presets: presets.presets });
  });

  socket.on("client_requests_join", data => {
    if (
      _.has(data, "roomname") &&
      _.isString(data.roomname) &&
      data.roomname.length > 0
    ) {
      if (!_.isNull(rooms.getRoom(data.roomname))) {
        if (rooms.getRoom(data.roomname).anonym) {
          users.createUser(socket.id, "Anonym");
          rooms.addUser(data.roomname, socket.id);
          socket.emit("server_sends_votedata", {
            roomname: data.roomname,
            preset: presets.presets[rooms.getRoom(data.roomname).preset]
          });
        } else {
          socket.emit("server_requests_name", name => {
            if (
              _.isString(name) &&
              name.length > 0 &&
              !users.existsUser(name)
            ) {
              users.createUser(socket.id, name);
              rooms.addUser(data.roomname, socket.id);
              socket.emit("server_confirmes_join", {
                roomname: data.roomname,
                preset: presets.presets[rooms.getRoom(data.roomname).preset]
              });
            }
          });
        }
      } else {
        console.log(
          "Node | Client requests to join room | Invalid Name: ",
          data.roomname
        );
      }

      console.log(
        "Node | Client requests to join room | ID: ",
        socket.id,
        " | Roomname: ",
        data.roomname
      );
    } else {
      console.log("Node | Client requests to join room | Request is invalid");
    }
  });

  socket.on("client_sends_vote", data => {
    rooms.addVote(rooms.getRoomUserIsIn(socket.id).name, socket.id, data.votes);
    socket.emit("server_confirms_vote");

    let userRoom = rooms.getRoomUserIsIn(socket.id);
    for (let user of userRoom.users) {
      io.to(user).emit(
        "server_sends_chart",
        charts.generateCharts(presets.presets[userRoom.preset], userRoom.votes)
      );
    }
  });

  socket.on("client_requests_votedata", () => {
    let userRoom = rooms.getRoomUserIsIn(socket.id);
    socket.emit("server_sends_votedata", {
      preset: presets.presets[userRoom.preset],
      roomname: userRoom.name
    });
  });

  socket.on("client_sends_message", () => {});

  socket.on("client_sends_reset", () => {
    let userRoom = rooms.getRoomUserIsIn(socket.id);
    userRoom.votes = [];
    for (let user of userRoom.users) {
      io.to(user).emit("server_sends_votedata", {
        preset: presets.presets[userRoom.preset],
        roomname: userRoom.name
      });
    }
  });
});

