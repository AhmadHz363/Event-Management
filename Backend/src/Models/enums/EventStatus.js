class Eventstatus {
  static SCHEDULED = "scheduled";
  static CANCELED = "canceled";
  static COMPLETED = "completed";
  static ACTIVE = "active";

  static values() {
    return [this.SCHEDULED, this.CANCELED, this.COMPLETED,this.ACTIVE];
  }

  static isValid(role) {
    return this.values().includes(role);
  }
}

Object.freeze(Eventstatus); // Prevent modification
module.exports = Eventstatus;
