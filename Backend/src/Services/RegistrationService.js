const Registration = require("../Models/Registrations");
const Parse = require("../Config/parseConfig");
const RegistrationStatus = require("../Models/enums/RegistrationStatus");
const UserService = require("./UserServices");
const EventServices = require("./EventService");

class RegistrationService {

  async create(data) {
    try {
      const registration = new Registration();

      // Validate required fields
      if (!data.user) {
        throw new Parse.Error(Parse.Error.VALIDATION_ERROR, "User is required");
      } else {
        const user = await  UserService.getById(data.user);
    
        if (!user.success || !user.data) {
          return {
            success: false,
            error: "User not found",
            code: 404,
          };
        }
      }

      if (!data.event) {
        throw new Parse.Error(
          Parse.Error.VALIDATION_ERROR,
          "Event is required"
        );
      } else {
        const event = await  EventServices.getById(data.event);

        if (!event.success || !event.data) {
          return {
            success: false,
            error: "Event not found",
            code: 404,
          };
        }
      }

      // Create pointers
      const userPointer = new Parse.User();
      userPointer.id = data.user; // Pointer to _User class

      const eventPointer = new Parse.Object("Event");
      eventPointer.id = data.event; // Pointer to Event class

      // Set default values
      const status = data.status || RegistrationStatus.PENDING;
      const registeredAt = data.registeredAt || new Date();

      // Validate status
      if (!RegistrationStatus.isValid(status)) {
        throw new Parse.Error(
          Parse.Error.VALIDATION_ERROR,
          `Invalid status. Must be one of: ${RegistrationStatus.values().join(
            ", "
          )}`
        );
      }

      // Set fields
      registration.set("user", userPointer);
      registration.set("event", eventPointer);
      registration.set("status", status);
      registration.set("registeredAt", new Date(registeredAt));

      // Check for duplicate registration
      const RegistrationQuery = new Parse.Query(Registration);
      RegistrationQuery.equalTo("user", userPointer);
      RegistrationQuery.equalTo("event", eventPointer);
      const existingRegistration = await RegistrationQuery.first({
        useMasterKey: true,
      });

      if (existingRegistration) {
        throw new Parse.Error(
          Parse.Error.DUPLICATE_VALUE,
          "User is already registered for this event"
        );
      }

      // Save with master key to bypass any ACL restrictions
      const savedRegistration = await registration.save(null, {
        useMasterKey: true,
      });

      return {
        success: true,
        data: savedRegistration.toJSON(),
      };
    } catch (error) {
      console.error("Registration creation error:", error);

      let statusCode = 500;
      let errorMessage = error.message;

      switch (error.code) {
        case Parse.Error.VALIDATION_ERROR:
          statusCode = 400;
          break;
        case Parse.Error.DUPLICATE_VALUE:
          statusCode = 409;
          break;
        case Parse.Error.OBJECT_NOT_FOUND:
          statusCode = 404;
          errorMessage = "User or Event not found";
          break;
      }

      return {
        success: false,
        error: errorMessage,
        code: statusCode,
      };
    }
  }

  async getAll({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    filters = {},
  } = {}) {
    const query = new Parse.Query(Registration);

    // Include related objects for richer response
    query.include("user");
    query.include("event");

    // Apply filters
    if (filters.userId) {
      const userPointer = new Parse.User();
      userPointer.id = filters.userId;
      query.equalTo("user", userPointer);
    }

    if (filters.eventId) {
      const eventPointer = new Parse.Object("Event");
      eventPointer.id = filters.eventId;
      query.equalTo("event", eventPointer);
    }

    if (filters.status) {
      query.equalTo("status", filters.status);
    }

    if (filters.fromDate || filters.toDate) {
      const from = filters.fromDate
        ? new Date(filters.fromDate)
        : new Date("1970-01-01");
      const to = filters.toDate ? new Date(filters.toDate) : new Date();
      query.greaterThanOrEqualTo("registeredAt", from);
      query.lessThanOrEqualTo("registeredAt", to);
    }

    // Sorting
    if (sortOrder === "desc") {
      query.descending(sortBy);
    } else {
      query.ascending(sortBy);
    }

    // Pagination
    query.skip((page - 1) * limit);
    query.limit(limit);

    // Count total with same filters
    const countQuery = new Parse.Query(Registration);
    if (filters.userId) {
      const userPointer = new Parse.User();
      userPointer.id = filters.userId;
      countQuery.equalTo("user", userPointer);
    }

    if (filters.eventId) {
      const eventPointer = new Parse.Object("Event");
      eventPointer.id = filters.eventId;
      countQuery.equalTo("event", eventPointer);
    }

    if (filters.status) {
      countQuery.equalTo("status", filters.status);
    }

    if (filters.fromDate || filters.toDate) {
      const from = filters.fromDate
        ? new Date(filters.fromDate)
        : new Date("1970-01-01");
      const to = filters.toDate ? new Date(filters.toDate) : new Date();
      countQuery.greaterThanOrEqualTo("registeredAt", from);
      countQuery.lessThanOrEqualTo("registeredAt", to);
    }

    const total = await countQuery.count({ useMasterKey: true });
    const results = await query.find({ useMasterKey: true });

    return {
      data: results.map((reg) => reg.toJSON()),
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
      const query = new Parse.Query(Registration);
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
          error: "Registration not found",
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

  async update(id, data) {
    try {
      const registrationQuery = new Parse.Query(Registration);
      const registration = await registrationQuery.get(id, {
        useMasterKey: true,
      });

      if (!registration) {
        throw new Parse.Error(
          Parse.Error.OBJECT_NOT_FOUND,
          "Registration not found"
        );
      }

      // Optional: update user
      if (data.user) {
        const userPointer = new Parse.User();
        userPointer.id = data.user;
        registration.set("user", userPointer);
      }

      // Optional: update event
      if (data.event) {
        const eventPointer = new Parse.Object("Event");
        eventPointer.id = data.event;
        registration.set("event", eventPointer);
      }

      // Optional: update status
      if (data.status) {
        if (!RegistrationStatus.isValid(data.status)) {
          throw new Parse.Error(
            Parse.Error.VALIDATION_ERROR,
            `Invalid status. Must be one of: ${RegistrationStatus.values().join(
              ", "
            )}`
          );
        }
        registration.set("status", data.status);
      }

      // Optional: update registeredAt
      if (data.registeredAt) {
        registration.set("registeredAt", new Date(data.registeredAt));
      }

      const updatedRegistration = await registration.save(null, {
        useMasterKey: true,
      });

      return {
        success: true,
        data: updatedRegistration.toJSON(),
      };
    } catch (error) {
      console.error("Registration update error:", error);

      let statusCode = 500;
      let errorMessage = error.message;

      switch (error.code) {
        case Parse.Error.VALIDATION_ERROR:
          statusCode = 400;
          break;
        case Parse.Error.OBJECT_NOT_FOUND:
          statusCode = 404;
          break;
      }

      return {
        success: false,
        error: errorMessage,
        code: statusCode,
      };
    }
  }

  async delete(id) {
    try {
      const response = await this.getById(id);

      if (!response.success || !response.data) {
        return {
          success: false,
          error: "Registration not found",
          code: 404,
        };
      }

      const registration = response.data;
      await registration.destroy({ useMasterKey: true });

      return {
        success: true,
        message: "Registration deleted successfully",
        code: 200,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Internal server error",
        code: error.code || 500,
      };
    }
  }
}

module.exports = new RegistrationService();

