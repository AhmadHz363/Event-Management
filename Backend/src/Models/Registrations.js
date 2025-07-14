const Parse = require('../Config/parseConfig');

class Registration extends Parse.Object {
  constructor() {
    super('Registration');
  }

  get user() {
    return this.get('user');
  }
  set user(value) {
    this.set('user', value);
  }

  get event() {
    return this.get('event');
  }
  set event(value) {
    this.set('event', value);
  }

  get status() {
    return this.get('status');
  }
  set status(value) {
    this.set('status', value);
  }

  get registeredAt() {
    return this.get('registeredAt');
  }
  set registeredAt(value) {
    this.set('registeredAt', value);
  }
}

module.exports = Registration;
