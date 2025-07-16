import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';

class UserModel extends ParseUser implements ParseCloneable {
  UserModel(String? username, String? password, String? emailAddress)
      : super(username, password, emailAddress);

  UserModel.clone() : this(null, null, null);

  UserModel.forQuery() : super(null, null, null);

  @override
  clone(Map map) => UserModel.clone()..fromJson(map as Map<String, dynamic>);

  static Future<UserModel?> getCurrentUser() async {
    final ParseUser? parseUser = await ParseUser.currentUser();
    if (parseUser != null) {
      return UserModel.clone()..fromJson(parseUser.toJson());
    }
    return null;
  }

  // Keys for Parse fields
  static const String keyUsername = 'username';
  static const String keyEmail = 'email';
  static const String keyPassword = 'password';
  static const String keyRole = 'role';
  static const String keyStatus = 'status';
  static const String keyRegistrations = 'registrations';

  // Getters and setters
  String? get getUsername => get<String>(keyUsername);
  set setUsername(String value) => set<String>(keyUsername, value);

  String? get getEmail => get<String>(keyEmail);
  set setEmail(String value) => set<String>(keyEmail, value);

  set setPassword(String value) => set<String>(keyPassword, value);

  String? get getRole => get<String>(keyRole);
  set setRole(String value) => set<String>(keyRole, value);

  String? get getStatus => get<String>(keyStatus);
  set setStatus(String value) => set<String>(keyStatus, value);

  ParseRelation<ParseObject> get getRegistrations =>
      get<ParseRelation<ParseObject>>(keyRegistrations)!;
}
