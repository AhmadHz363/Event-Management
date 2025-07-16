import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../Services/auth_services.dart';
import 'login_event.dart';
import 'login_state.dart';

class LoginBloc extends Bloc<LoginEvent, LoginState> {
  final BuildContext context;

  LoginBloc(this.context) : super(LoginInitial()) {
    on<LoginSubmitted>(_onLoginSubmitted);
    print('✅ LoginBloc initialized');
  }

  Future<void> _onLoginSubmitted(
    LoginSubmitted event,
    Emitter<LoginState> emit,
  ) async {
    print('➡️ LoginSubmitted event triggered');
    print('📧 Email: ${event.email}');
    print('🔒 Password: ${'*' * event.password.length}'); // Don't print real password

    emit(LoginLoading());
    print('⏳ State: LoginLoading emitted');

    try {
      bool result = await AuthServices.login(
        event.password,
        event.email,
        context,
      );

      if (result) {
        print('✅ Login successful');
        emit(LoginSuccess());
        print('🚀 State: LoginSuccess emitted');
      } else {
        print('❌ Login failed - Invalid email or password');
        emit(LoginFailure("Invalid email or password"));
        print('🛑 State: LoginFailure emitted');
      }
    } catch (e, stackTrace) {
      print('💥 Exception during login: $e');
      print(stackTrace);
      emit(LoginFailure("An unexpected error occurred"));
      print('🛑 State: LoginFailure emitted with error');
    }
  }
}
