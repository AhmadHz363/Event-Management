

class RegistrationStatus {
 static PENDING= 'pending';
static  CONFIRMED= 'confirmed';
static  CANCELLED= 'cancelled';
 static ATTENDED= 'attended';
  static values() {
    return  [this.PENDING, this.CONFIRMED, this.CANCELLED, this.ATTENDED];
  }

  static isValid(role) {
    return this.values().includes(role);
  }
}

Object.freeze(RegistrationStatus); // Prevent modification
module.exports = RegistrationStatus;
