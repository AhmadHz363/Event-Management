import 'package:flutter/material.dart';
import 'package:frontend_2/Configs/router_config.dart';
import 'package:frontend_2/Features/Login/login_page.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'Configs/global_configs.dart';
import 'Features/Login/authCubit.dart';
import 'Views/Home/home.dart';

class App extends StatefulWidget {
  const App({Key? key}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _AppState createState() => _AppState();
}

class _AppState extends State<App> with WidgetsBindingObserver {
  late final Authcubit _authCubit;

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _authCubit.close();
    super.dispose();
  }

  @override
  void initState() {
    super.initState();
    _authCubit = Authcubit()..checkLoginStatus();
  }

  @override
  Widget build(BuildContext context) {
    return BlocProvider.value(
      value: _authCubit,
      child: MaterialApp(
        title: Config.appName,
        debugShowCheckedModeBanner: false,
        routes: AppRouter.routes,
        home: BlocBuilder<Authcubit, AuthStatus>(
          builder: (context, state) {
            switch (state) {
              case AuthStatus.unknown:
                return const Scaffold(
                  body: Center(child: CircularProgressIndicator()),
                );
              case AuthStatus.authenticated:
                return HomePage(); // user logged in, show HomePage
              case AuthStatus.unauthenticated:
              default:
                return LoginPage(); // user not logged in, show LoginPage
            }
          },
        ),
      ),
    );
  }
}





