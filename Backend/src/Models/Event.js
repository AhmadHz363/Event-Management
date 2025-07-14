const Parse = require('../Config/parseConfig');

class Event extends Parse.Object {
  constructor() {
    super('Event');
  }

  get title() {
    return this.get('title');
  }
  set title(value) {
    this.set('title', value);
  }

  get description() {
    return this.get('description');
  }
  set description(value) {
    this.set('description', value);
  }

  get location() {
    return this.get('location');
  }
  set location(value) {
    this.set('location', value);
  }

  get startDate() {
    return this.get('startDate');
  }
  set startDate(value) {
    this.set('startDate', value);
  }

  get endDate() {
    return this.get('endDate');
  }
  set endDate(value) {
    this.set('endDate', value);
  }

  get maxParticipants() {
    return this.get('maxParticipants');
  }
  set maxParticipants(value) {
    this.set('maxParticipants', value);
  }

  get eventType() {
    return this.get('eventType');
  }
  set eventType(value) {
    this.set('eventType', value);
  }

  get organizer() {
    return this.get('organizer');
  }
  set organizer(value) {
    this.set('organizer', value);
  }

  get tags() {
    return this.relation('tags');
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

module.exports = Event;
