
const User = require('../Models/User');
const Parse = require('../Config/parseConfig');
const UserStatus= require("../Models/enums/UserStatus");
const UserRoles= require("../Models/enums/UserRoles");
class UserService {
  async create({ username, email, password, role, profile, status }) {
    const user = new User();
    user.setUsername(username);
    user.setEmail(email);
    user.setPassword(password);
    user.set('role', role);
    user.set('status', status); 
    return await user.signUp();
  }

// async getById(id) {
//   const query = new Parse.Query(User); 
//   return await query.get(id, { useMasterKey: true });
// }


async getById(id) {
  try {
    const query = new Parse.Query(User);
    const result = await query.get(id, { useMasterKey:true});
    
    return {
      success: true,
      data: result
    };
  } catch (error) {
    // Handle not found error specifically
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return {
        success: false,
        error: 'User not found',
        code: 404
      };
    }
    
    // Handle other errors
    return {
      success: false,
      error: error.message,
      code: error.code || 500
    };
  }
}

 async update(id, updateData) {
  try {
    const query = new Parse.Query(User);

    const response = await this.getById(id); 

    if (!response.success || !response.data) {
      return {
        success: false,
        error: 'User not found',
        code: 404
      };
    }

    const user = response.data;
      // Validation: Check if role and status are valid
    if (updateData.status !== undefined && !UserStatus.isValid(updateData.status)) {
      return {
        success: false,
        error: 'Invalid status provided.',
        code: 400
      };
    }

    if (updateData.role !== undefined && !UserRoles.isValid(updateData.role)) {
      return {
        success: false,
        error: 'Invalid role provided.',
        code: 400
      };
    }
    // Update only the allowed fields that exist in updateData
    const allowedFields = ['username', 'email', 'role', 'status'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        user.set(field, updateData[field]);
      }
    });

    const updatedUser = await user.save(null,{ useMasterKey: true });

    return {
      success: true,
      data: updatedUser
    };
  } catch (error) {
    // Handle not found error
    if (error.code === Parse.Error.OBJECT_NOT_FOUND) {
      return {
        success: false,
        error: 'User not found',
        code: 404
      };
    }

    // Handle validation/constraint errors
    if (error.code === Parse.Error.VALIDATION_ERROR ||
        error.code === Parse.Error.DUPLICATE_VALUE) {
      return {
        success: false,
        error: error.message,
        code: 400
      };
    }

    // Handle other errors
    return {
      success: false,
      error: error.message,
      code: error.code || 500
    };
  }
}
async getAll({
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  filters = {}
} = {}) {
  const  user= new User();
  const query = new Parse.Query(user);

  // Apply filters
  if (filters.username) {
    query.contains('username', filters.username);
  }
  if (filters.email) {
    query.contains('email', filters.email);
  }
  if (filters.role) {
    query.equalTo('role', filters.role);
  }
  if (filters.status) {
    query.equalTo('status', filters.status);  // lowercase 'status'
  }

  // Apply sorting
  if (sortOrder === 'desc') {
    query.descending(sortBy);
  } else {
    query.ascending(sortBy);
  }

  // Apply pagination
  query.skip((page - 1) * limit);
  query.limit(limit);

  // Count query for pagination metadata
  const countQuery = new Parse.Query(User);
  if (Object.keys(filters).length > 0) {
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        if (key === 'username' || key === 'email') {
          countQuery.contains(key, filters[key]);
        } else {
          countQuery.equalTo(key, filters[key]);
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
      totalPages: Math.ceil(total / limit)
    }
  };
}
async delete(id) {
  try {
    const response = await this.getById(id);

    if (!response.success || !response.data) {
      return {
        success: false,
        error: 'User not found',
        code: 404
      };
    }

    const user = response.data;
    await user.destroy({ useMasterKey: true });

    return {
      success: true,
      message: 'User deleted successfully',
      code: 200
    };

  } catch (error) {
    return {
      success: false,
      error: error.message || 'Internal server error',
      code: error.code || 500
    };
  }
}

}

module.exports = new UserService();