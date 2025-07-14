
class UserStatus {
  static SCHEDULED = 'scheduled';
  static CANCELED = 'canceled';
  static COMPLETED = 'completed';

  static values() {
    return [this.ADMIN, this.ORGANIZER, this.PARTICIPANT];
  }

  static isValid(role) {
    return this.values().includes(role);
  }
}

Object.freeze(UserStatus); // Prevent modification
module.exports = UserStatus;
