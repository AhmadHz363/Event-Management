const Registration = require('../Models/Registrations');
const Parse = require('../Config/parseConfig');

class RegistrationService {
  async create(data) {
    const registration = new Registration();

    Object.entries(data).forEach(([key, value]) => {
      registration.set(key, value);
    });

    return await registration.save();
  }

  async getById(id) {
    const query = new Parse.Query(Registration);
    return await query.get(id);
  }

  async update(id, data) {
    const registration = await this.getById(id);

    Object.entries(data).forEach(([key, value]) => {
      registration.set(key, value);
    });

    return await registration.save();
  }

  async delete(id) {
    const registration = await this.getById(id);
    return await registration.destroy();
  }
}

module.exports = new RegistrationService();
