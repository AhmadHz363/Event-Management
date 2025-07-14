const EventCategory = require('../Models/EventCategory');
const Parse = require('../Config/parseConfig');

class EventCategoryService {
  async create(data) {
    const category = new EventCategory();

    Object.entries(data).forEach(([key, value]) => {
      category.set(key, value);
    });

    return await category.save();
  }

  async getById(id) {
    const query = new Parse.Query(EventCategory);
    return await query.get(id);
  }

  async update(id, data) {
    const category = await this.getById(id);

    Object.entries(data).forEach(([key, value]) => {
      category.set(key, value);
    });

    return await category.save();
  }

  async delete(id) {
    const category = await this.getById(id);
    return await category.destroy();
  }
}

module.exports = new EventCategoryService();
