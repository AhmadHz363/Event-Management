import 'package:frontend_2/Models/UserModel.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';

class EventModel extends ParseObject implements ParseCloneable {
  EventModel() : super('Event');

  EventModel.clone() : this();

  @override
  clone(Map map) => EventModel.clone()..fromJson(map as Map<String, dynamic>);

  // Keys
  static const String keyTitle = 'title';
  static const String keyDescription = 'description';
  static const String keyLocation = 'location';
  static const String keyStartDate = 'startDate';
  static const String keyEndDate = 'endDate';
  static const String keyMaxParticipants = 'maxParticipants';
  static const String keyEventType = 'eventType';
  static const String keyOrganizer = 'organizer';
  static const String keyTags = 'tags';
  static const String keyStatus = 'status';
  static const String keyRegistrations = 'registrations';

  // Getters and setters
  String? get title => get<String>(keyTitle);
  set title(String? value) => set<String>(keyTitle, value!);

  String? get description => get<String>(keyDescription);
  set description(String? value) => set<String>(keyDescription, value!);

  String? get location => get<String>(keyLocation);
  set location(String? value) => set<String>(keyLocation, value!);

  DateTime? get startDate => get<DateTime>(keyStartDate);
  set startDate(DateTime? value) => set<DateTime>(keyStartDate, value!);

  DateTime? get endDate => get<DateTime>(keyEndDate);
  set endDate(DateTime? value) => set<DateTime>(keyEndDate, value!);

  int? get maxParticipants => get<int>(keyMaxParticipants);
  set maxParticipants(int? value) => set<int>(keyMaxParticipants, value!);

  String? get eventType => get<String>(keyEventType);
  set eventType(String? value) => set<String>(keyEventType, value!);

  // Assuming organizer is a pointer to another ParseObject (e.g., User)
  UserModel? get organizer => get<UserModel>(keyOrganizer);
  set organizer(UserModel? value) => set<UserModel>(keyOrganizer, value!);

  String? get status => get<String>(keyStatus);
  set status(String? value) => set<String>(keyStatus, value!);

  ParseRelation<ParseObject> get registrations =>
      get<ParseRelation<ParseObject>>(keyRegistrations)!;
}
