import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:frontend_2/Services/auth_services.dart';
import 'register_event.dart';
import 'register_state.dart';

import 'package:flutter/material.dart';

class RegisterBloc extends Bloc<RegisterEvent, RegisterState> {
  final BuildContext context;

  RegisterBloc(this.context) : super(RegisterInitial()) {
    on<RegisterSubmitted>(_onRegisterSubmitted);
  }

  Future<void> _onRegisterSubmitted(
      RegisterSubmitted event, Emitter<RegisterState> emit) async {
    emit(RegisterLoading());

    bool result = await AuthServices.signup(
      username: event.username,
      email: event.email,
      password: event.password,
      context: context,
    );

    if (result) {
      emit(RegisterSuccess());
    } else {
      emit(RegisterFailure("Signup failed. Please check your input."));
    }
  }
}
