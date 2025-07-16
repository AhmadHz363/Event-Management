import 'package:flutter/material.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';

import '../Models/UserModel.dart';
import '../Utitlities/helper_classes/main_helper.dart';
import '../Views/Home/home.dart';

class AuthServices {
  static Future<bool> login(
  String password,
  String email,
  BuildContext context,
) async {
  try {
    print('➡️ Starting login process');
    print('📧 Email: $email');
    print('🔒 Password: ${'*' * password.length}'); // Masked for safety

    final user = ParseUser(email, password, null);
    print('📤 Attempting login with ParseUser');

    var response = await user.login();
    print('📥 Parse response received: success=${response.success}');

    if (response.success) {
      print('✅ Login success from server');

      UserModel? currentUser = await UserModel.getCurrentUser();
      if (currentUser != null) {
        print('🙋 User fetched: ${currentUser.getUsername}');
        await MainHelper.saveUserToPrefs(currentUser);
        print('💾 User saved to local preferences');
      } else {
        print('⚠️ Failed to retrieve user after login');
      }

      MainHelper.goToNavigatorScreen(
        context,
        HomePage(currentUser: currentUser),
      );
      print('🚀 Navigation to HomePage triggered');

      return true;
    } else {
      print('❌ Login failed: ${response.error?.message}');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Incorrect email or password')),
      );
      return false;
    }
  } catch (e, stackTrace) {
    print('💥 Exception during login: $e');
    print(stackTrace);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Login failed: ${e.toString()}')),
    );
    return false;
  }
}

  static Future<bool> signup({
  required String username,
  required String email,
  required String password,
  required BuildContext context,
  String role = 'participant', // Default role
  String status = 'active', // Default status
}) async {
  try {
    final user = UserModel(username, password, email);
    user.setRole = role;
    user.setStatus = status;
    debugPrint("test test");

    final ParseResponse response = await user.signUp();

    if (response.success) {
      // Get current user details
      UserModel? currentUser = await UserModel.getCurrentUser();
      if (currentUser != null) {
        await MainHelper.saveUserToPrefs(currentUser);
      }

      // Navigate to home
      MainHelper.goToNavigatorScreen(
        context,
        HomePage(currentUser: currentUser),
      );

      return true;
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Signup failed: ${response.error?.message ?? 'Unknown error'}')),
      );
      return false;
    }
  } catch (e) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Signup error: ${e.toString()}')),
    );
    return false;
  }
}

}