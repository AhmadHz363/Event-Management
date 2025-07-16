import 'package:frontend_2/Models/UserModel.dart';
import 'package:frontend_2/Models/EventModel.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';

import '../Models/RegistrationModels.dart';

class EventRegistration {
  static Future<ParseResponse> createRegistration({
    required EventModel event,
    String status = 'pending',
  }) async {
    UserModel? user = await UserModel.getCurrentUser();
    final registration = RegistrationModel()
      ..user = user as UserModel?
      ..event = event
      ..status = status
      ..registeredAt = DateTime.now();

    return await registration.save();
  }

  static Future<bool> checkRegistered({
    required EventModel event,
  }) async {
    UserModel? user = await UserModel.getCurrentUser();

    if (user == null) return false;

    final query = QueryBuilder<RegistrationModel>(RegistrationModel())
      ..whereEqualTo(RegistrationModel.keyUser, user.toPointer())
      ..whereEqualTo(RegistrationModel.keyEvent, event.toPointer());

    final response = await query.query();

    print("test test ${response.success}");
    return response.success &&
        response.results != null &&
        response.results!.isNotEmpty;
  }
}
