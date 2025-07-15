const Parse = require('../Config/parseConfig');
const Eventstatus = require('../Models/enums/EventStatus');

class EventStatisticServices {
  static async getEventCount() {
    const query = new Parse.Query('Event');
    return await query.count();
  }

  static async getEventStatusBreakdown() {
    const statuses = Eventstatus.values();
    const result = {};

    for (const status of statuses) {
      const query = new Parse.Query('Event');
      query.equalTo('status', status);
      const count = await query.count();
      result[status] = count;
    }

    return result;
  }

 static async getRegistrationTrends({ fromDate, toDate }) {
  const query = new Parse.Query('Registration');

  if (fromDate) query.greaterThanOrEqualTo('registeredAt', new Date(fromDate));
  if (toDate) query.lessThanOrEqualTo('registeredAt', new Date(toDate));
  query.limit(1000);

  // Include related objects
  query.include('user');
  query.include('event');

  const registrations = await query.find();
  const trends = {};

  registrations.forEach((reg) => {
    const date = reg.get('registeredAt');
    if (!date) return;
    const key = date.toISOString().split('T')[0];

    const user = reg.get('user');
    const event = reg.get('event');

    const userName = user ? user.get('username') || user.get('name') : null;
    const eventTitle = event ? event.get('title') : null;

    if (!trends[key]) trends[key] = [];

    trends[key].push({
      registrationId: reg.id,
      userName,
      eventTitle,
      reg:reg
    });
  });

  // Format to return sorted array with more info
  return Object.keys(trends)
    .sort()
    .map((date) => ({
      date,
      count: trends[date].length,
      registrations: trends[date], // array of detailed objects
    }));
}

  static async getPopularEvents(limit = 5) {
    const Registration = Parse.Object.extend('Registration');
    const Event = Parse.Object.extend('Event');
    const query = new Parse.Query(Registration);
    query.include('event');
    query.limit(1000);

    const registrations = await query.find();

    const counts = {};

    registrations.forEach((reg) => {
      const event = reg.get('event');
      if (!event) return;

      const id = event.id;
      if (!counts[id]) {
        counts[id] = { event, count: 0 };
      }

      counts[id].count += 1;
    });

    const sorted = Object.values(counts)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    return sorted.map((item) => ({
      eventId: item.event.id,
      title: item.event.get('title'),
      registrations: item.count,
    }));
  }
}

module.exports = EventStatisticServices;
