

class UserRoles {
  static ADMIN = 'admin';
  static ORGANIZER = 'organizer';
  static PARTICIPANT = 'participant';

  static values() {
    return [this.ADMIN, this.ORGANIZER, this.PARTICIPANT];
  }

  static isValid(role) {
    return this.values().includes(role);
  }
}

Object.freeze(UserRoles); // Prevent modification
module.exports = UserRoles;
