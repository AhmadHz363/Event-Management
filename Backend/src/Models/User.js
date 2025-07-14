const Parse = require('../Config/parseConfig');

class User extends Parse.User {
  constructor() {
    super(); 
  }

  getUsername() {
    return this.get('username'); 
  }

  setUsername(value) {
    this.set('username', value); 
  }
  getEmail() {
    return this.get('email');
  }

  setEmail(value) {
    this.set('email', value); 
  }

  setPassword(value) {
    this.set('password', value); 
  }

  get role() {
    return this.get('role');
  }

  set role(value) {
    this.set('role', value);
  }

  get status() {
    return this.get('status');
  }

  set status(value) {
    this.set('status', value);
  }

  getRegistrations() {
    return this.relation('registrations');
  }
}

module.exports = User;
