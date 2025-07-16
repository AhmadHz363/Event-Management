import 'package:frontend_2/Models/EventModel.dart';
import 'package:frontend_2/Models/UserModel.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';

class RegistrationModel extends ParseObject implements ParseCloneable {
  RegistrationModel() : super('Registration');

  RegistrationModel.clone() : this();

  @override
  clone(Map map) => RegistrationModel.clone()..fromJson(map as Map<String, dynamic>);

  // Keys
  static const String keyUser = 'user';
  static const String keyEvent = 'event';
  static const String keyStatus = 'status';
  static const String keyRegisteredAt = 'registeredAt';

  // Getters and setters
  UserModel? get user => get<UserModel>(keyUser);
  set user(UserModel? value) => set<UserModel>(keyUser, value!);

  EventModel? get event => get<EventModel>(keyEvent);
  set event(EventModel? value) => set<EventModel>(keyEvent, value!);

  String? get status => get<String>(keyStatus);
  set status(String? value) => set<String>(keyStatus, value!);

  DateTime? get registeredAt => get<DateTime>(keyRegisteredAt);
  set registeredAt(DateTime? value) => set<DateTime>(keyRegisteredAt, value!);
}
