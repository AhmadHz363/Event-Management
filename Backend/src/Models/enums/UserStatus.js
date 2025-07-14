// models/enums/UserStatus.js

class UserStatus {
  static ACTIVE = 'active';
  static REMOVED = 'removed';
  static INACTIVE = 'inactive'; // Add more if needed

  static values() {
    return [this.ACTIVE, this.REMOVED, this.INACTIVE];
  }

  static isValid(status) {
    return this.values().includes(status);
  }
}

Object.freeze(UserStatus);
module.exports = UserStatus;
