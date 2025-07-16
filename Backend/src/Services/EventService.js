const Event = require("../Models/Event");
const Parse = require("../Config/parseConfig");
const User = require("../Models/User");
const EventStatus = require("../Models/enums/EventStatus");
const UserService = require("./UserServices");
class EventService {
  async create(data) {
    const event = new Event();

    // Validate required 'organizer'
    if (!data.organizer) {
      throw new Error("Organizer is required");
    }

    const organizerPointer = new User();
    organizerPointer.id = data.organizer;

    const allowedFields = [
      "title",
      "description",
      "location",
      "startDate",
      "endDate",
      "maxParticipants",
      "eventType",
      "status",
    ];

    event.set("organizer", organizerPointer);

    if (!data.status) {
      data.status = EventStatus.SCHEDULED;
    }
    // Set other allowed fields
    allowedFields.forEach((key) => {
      if (data[key] !== undefined) {
        let value = data[key];
        if (
          (key === "startDate" || key === "endDate") &&
          typeof value === "string"
        ) {
          value = new Date(value);
        }

        event.set(key, value);
      }
    });
    // Handle image upload
    if (data.imageFile) {
      try {
        const file = new Parse.File(data.imageFile.name, {
          base64: data.imageFile.base64,
        });
        event.set("image", file);
      } catch (e) {
        throw new Error("Image upload failed: " + e.message);
      }
    }
    return await event.save(null, { useMasterKey: true });
  }

  async getAllEvents({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    filters = {},
  } = {}) {
    const event = new Event();
    const query = new Parse.Query(event);

    // Apply filters
    if (filters.title) {
      query.contains("title", filters.title);
    }
    if (filters.location) {
      query.contains("location", filters.location);
    }
    if (filters.eventType) {
      query.equalTo("eventType", filters.eventType);
    }
    if (filters.status) {
      query.equalTo("status", filters.status);
    }
    if (filters.organizer) {
      query.equalTo("organizer", filters.organizer); // Assuming this is a pointer or string
    }

    // Apply sorting
    if (sortOrder === "desc") {
      query.descending(sortBy);
    } else {
      query.ascending(sortBy);
    }

    // Apply pagination
    query.skip((page - 1) * limit);
    query.limit(limit);

    // Count for pagination
    const countQuery = new Parse.Query(Event);
    if (Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((key) => {
        const value = filters[key];
        if (value) {
          if (["title", "location"].includes(key)) {
            countQuery.contains(key, value);
          } else {
            countQuery.equalTo(key, value);
          }
        }
      });
    }

    const total = await countQuery.count({ useMasterKey: true });
    const results = await query.find({ useMasterKey: true });

    return {
      data: results,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async getById(id) {
    try {
      const query = new Parse.Query(Event);
      const result = await query.get(id, { useMasterKey: true });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      // Handle not found error specifically
      if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
        return {
          success: false,
          error: "Event not found",
          code: 404,
        };
      }

      // Handle other errors
      return {
        success: false,
        error: error.message,
        code: error.code || 500,
      };
    }
  }

  async update(eventId, data) {
    const query = new Parse.Query(Event);
    const response = await this.getById(eventId);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: "Event not found",
        code: 404,
      };
    }
    const event = response.data;
    // If organizer is provided, update the pointer
    if (data.organizer) {
      const organizerPointer = new User(); // assuming User extends Parse.User
      organizerPointer.id = data.organizer;
      event.set("organizer", organizerPointer);
    }

    // Set default status if not provided
    if (!data.status) {
      data.status = EventStatus.SCHEDULED;
    }

    const allowedFields = [
      "title",
      "description",
      "location",
      "startDate",
      "endDate",
      "maxParticipants",
      "eventType",
      "status",
    ];

    allowedFields.forEach((key) => {
      if (data[key] !== undefined) {
        let value = data[key];

        if (
          (key === "startDate" || key === "endDate") &&
          typeof value === "string"
        ) {
          value = new Date(value);
        }

        event.set(key, value);
      }
    });

    return await event.save(null, { useMasterKey: true });
  }

  async delete(eventId) {
    try {
      const query = new Parse.Query(Event);
      const response = await this.getById(eventId);
      if (!response.success || !response.data) {
        return {
          success: false,
          error: "Event not found",
          code: 404,
        };
      }

      const event = response.data;
      await event.destroy({ useMasterKey: true });

      return {
        success: true,
        message: "Event deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 400,
      };
    }
  }
}

module.exports = new EventService();
