import 'dart:convert';

import 'package:flutter/material.dart';

import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../models/UserModel.dart';

class MainHelper {
    static Future<void> saveUserToPrefs(ParseUser user) async {
    final prefs = await SharedPreferences.getInstance();
    final userData = {
      'username': user.username,
      'email': user.emailAddress,
      'objectId': user.objectId
    };

    String jsonString = jsonEncode(userData);
    await prefs.setString('currentUser', jsonString);
  }

  static Future<ParseUser?> getUserFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    String? jsonString = prefs.getString('currentUser');
    if (jsonString == null) return null;

    final data = jsonDecode(jsonString);
    final user = ParseUser(null, null, null)
      ..username = data['username']
      ..emailAddress = data['email']
      ..objectId = data['objectId']
      ..sessionToken = data['sessionToken'];

    return user;
  }
  
  
  static Future<void> clearUserFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();

    final user = await ParseUser.currentUser();
    if (user != null) {
      final response = await user.logout();
      if (response.success) {
        print('✅ Logged out from Parse successfully.');
      } else {
        print('❌ Failed to logout from Parse: ${response.error?.message}');
      }
    }

    await prefs.remove('currentUser');

    final exists = prefs.containsKey('currentUser');
    if (!exists) {
      print('✅ User data successfully removed from SharedPreferences.');
    } else {
      print('❌ Failed to remove user data from SharedPreferences.');
    }
  }
  static goToNavigatorScreen(BuildContext context, Widget widget,
      {bool? finish = false, bool? back = true}) {
    if (finish == false) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) => widget,
        ),
      );
    } else {
      Navigator.pushAndRemoveUntil<dynamic>(
        context,
        MaterialPageRoute<dynamic>(
          builder: (BuildContext context) => widget,
        ),
        (route) => back!,
      );
    }
  }
}