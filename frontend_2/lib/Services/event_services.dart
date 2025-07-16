import 'package:frontend_2/Models/EventModel.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';

class EventServices {
 static Future<List<EventModel>> getAllEvents() async {
  try {
    QueryBuilder<EventModel> queryBuilder =
        QueryBuilder<EventModel>(EventModel())
          ..orderByDescending('createdAt')
          ..setLimit(20);

    final ParseResponse response = await queryBuilder.query();

    if (response.success && response.results != null) {
      final results = response.results as List<ParseObject>;

      // Map each ParseObject to EventModel using clone + fromJson
      return results
          .map((obj) => EventModel.clone()..fromJson(obj.toJson()))
          .toList();
    } else {
      print('Error: ${response.error?.message}');
      return [];
    }
  } catch (e) {
    print('Exception: $e');
    return [];
  }
}


 static Future<List<EventModel>> getUpcomingEvents() async {
    try {
      final now = DateTime.now();

      QueryBuilder<EventModel> queryBuilder =
          QueryBuilder<EventModel>(EventModel())
            ..whereGreaterThan('startDate', now)
            ..orderByAscending('startDate')
            ..setLimit(4);

      final ParseResponse response = await queryBuilder.query();

      if (response.success && response.results != null) {
        return response.results as List<EventModel>;
      } else {
        print('❌ Parse error: ${response.error?.message}');
        return [];
      }
    } catch (e) {
      print('💥 Exception during event fetch: $e');
      return [];
    }
  }
}
