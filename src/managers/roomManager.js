const _ = require("lodash");

module.exports = class {
  constructor() {
    this.rooms = [];
  }

  createRoom(name, preset, anonym) {
    if (!this.existsRoom(name)) {
      this.rooms[this.rooms.length] = {
        name: name,
        users: [],
        votes: [],
        new: true,
        preset: preset,
        anonym: anonym
      };
    }
  }

  existsRoom(name) {
    for (let room of this.rooms) {
      if (_.isEqual(room.name, name)) {
        return true;
      }
    }
    return false;
  }

  removeRoom(name) {
    if (this.existsRoom(name)) {
      for (let room of this.rooms) {
        if (_.isEqual(room.name, name)) {
          _.pull(this.rooms, room);
        }
      }
    }
  }

  addUser(name, userid) {
    if (this.existsRoom(name)) {
      for (let room of this.rooms) {
        if (_.isEqual(room.name, name)) {
          room.users.forEach(user => {
            if (_.isEqual(user, userid)) {
              return;
            }
          });
          room.users[room.users.length] = userid;
          room.new = false;
        }
      }
    }
  }

  removeUser(name, userid) {
    if (this.existsRoom(name)) {
      for (let room of this.rooms) {
        if (_.isEqual(room.name, name)) {
          _.pull(room.users, userid);
        }
      }
    }
    this.checkDelete();
  }

  removeUserEverywhere(userid) {
    for (let room of this.rooms) {
      _.pull(room.users, userid);
    }
    this.checkDelete();
  }

  getRoom(name) {
    if (this.existsRoom(name)) {
      for (let room of this.rooms) {
        if (_.isEqual(name, room.name)) {
          return room;
        }
      }
    }
    return null;
  }

  getRooms() {
    return this.rooms;
  }

  getRoomUserIsIn(userid) {
    for (let room of this.rooms) {
      for (let user of room.users) {
        if (_.isEqual(user, userid)) {
          return room;
        }
      }
    }
    return null;
  }

  addVote(name, userid, vote) {
    if (this.existsRoom(name)) {
      let room = this.getRoom(name);
      room.votes.forEach(vote => {
        if (_.isEqual(vote.userid, userid)) {
          _.pull(room.votes, vote);
        }
      });

      room.votes[room.votes.length] = {
        userid: userid,
        vote: vote
      };
    }
  }

  checkDelete() {
    for (let room of this.rooms) {
      if (!room.new && room.users.length <= 0) {
        this.removeRoom(room.name);
      }
    }
  }
};

