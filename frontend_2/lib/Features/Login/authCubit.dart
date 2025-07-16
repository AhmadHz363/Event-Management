import 'package:flutter_bloc/flutter_bloc.dart';

import '../../Models/UserModel.dart';
import '../../Utitlities/helper_classes/main_helper.dart';

enum AuthStatus { unknown, authenticated, unauthenticated }

class Authcubit extends Cubit<AuthStatus> {
  Authcubit() : super(AuthStatus.unknown);

  Future<void> checkLoginStatus() async {
    final currentUser = await UserModel.getCurrentUser();
    if (currentUser != null) {
      emit(AuthStatus.authenticated);
    } else {
      emit(AuthStatus.unauthenticated);
    }
  }

  /// Logout method
  Future<void> logout() async {
    final user = await UserModel.getCurrentUser();
    if (user != null) {
      await user.logout();
      await MainHelper.clearUserFromPrefs();
    }
    emit(AuthStatus.unauthenticated);
  }
}
