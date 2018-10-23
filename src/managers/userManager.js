const _ = require("lodash");

module.exports = class {
  constructor() {
    this.users = [];
  }

  createUser(userid, name) {
    this.users[this.users.length] = {
      id: userid,
      name: name
    };
  }

  existsUser(userid) {
    for (let user of this.users) {
      if (_.isEqual(user.id, userid)) {
        return true;
      }
    }
    return false;
  }

  removeUser(userid) {
    if (this.existsUser(userid)) {
      for (let user of this.users) {
        if (_.isEqual(user.id, userid)) {
          _.pull(this.users, user);
        }
      }
    }
  }

  getUser(userid) {
    if (this.existsUser(userid)) {
      for (let user of this.users) {
        if (_.isEqual(user.id, userid)) {
          return user;
        }
      }
    }
    return null;
  }

  getUsers() {
    return this.users;
  }
};

