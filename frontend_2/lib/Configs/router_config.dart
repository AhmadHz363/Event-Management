import 'package:flutter/material.dart';

import '../Views/Home/home.dart';
// import 'package:senior_project/views/Policy_and_Terms/Privacy_Policy.dart';
// import 'package:senior_project/views/authentication/signin_page.dart';
// import 'package:senior_project/views/home/home_page.dart';
// import 'package:senior_project/views/home/landing/landing_page.dart';
// import 'package:senior_project/views/home/notification/notification_page.dart';
// import 'package:senior_project/views/home/profile/profile_page.dart';
// import 'package:senior_project/views/home/schedual/schedual_page.dart';

// import '../views/Policy_and_Terms/Terms_of_services.dart';

class AppRouter {
  static final RouteObserver<PageRoute> routeObserver = RouteObserver();
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case HomePage.route:
        return MaterialPageRoute(builder: (_) => HomePage());
      // case SignInPage.route:
      //   return MaterialPageRoute(builder: (_) => SignInPage());
      // case LandingPage.route:
      //   return MaterialPageRoute(builder: (_) => LandingPage());
      // case SchedulePage.route:
      //   return MaterialPageRoute(builder: (_) => SchedulePage());
      // case ProfilePage.route:
      //   return MaterialPageRoute(builder: (_) => ProfilePage());
      // case NotificationsPage.route:
      //   return MaterialPageRoute(builder: (_) => NotificationsPage());
      // case PrivacyPolicyPage.route:
      //   return MaterialPageRoute(builder: (_) => PrivacyPolicyPage());
      // case TermsOfServicePage.route:
      //   return MaterialPageRoute(builder: (_) => TermsOfServicePage());
      default:
        return MaterialPageRoute(
            builder: (_) => Scaffold(
                  body: Center(
                      child: Text('No route defined for ${settings.name}')),
                ));
    }
  }

  static Map<String, Widget Function(BuildContext)> routes = {
    // SignInPage.route: (_) => SignInPage(),
    HomePage.route: (_) => HomePage(),
    // LandingPage.route: (_) => LandingPage(),
    // SchedulePage.route: (_) => SchedulePage(),
    // ProfilePage.route: (_) => ProfilePage(),
    // NotificationsPage.route: (_) => NotificationsPage(),
    // PrivacyPolicyPage.route: (_) => PrivacyPolicyPage(),
    // TermsOfServicePage.route: (_)=> TermsOfServicePage()
  };
}
