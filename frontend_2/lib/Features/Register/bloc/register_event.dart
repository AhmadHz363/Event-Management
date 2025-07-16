abstract class RegisterEvent {}

class RegisterSubmitted extends RegisterEvent {
  final String username;
  final String email;
  final String password;

  RegisterSubmitted({
    required this.username,
    required this.email,
    required this.password,
  });
}
