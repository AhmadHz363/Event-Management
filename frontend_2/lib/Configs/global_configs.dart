import 'dart:ui';

import 'package:flutter/foundation.dart';

class Config {
  static const bool isDebug = kDebugMode;
  static String appName = "Event Managment App";
  static const String packageName = "com.assis.event_management";
  static const String appVersion = "1.0.0";

  //parse server configurations
  static const String serverUrl = "https://parseapi.back4app.com/";
  static const String appId = "nitXnxGaI4YGBAeKljTTtkoGY6r2KwjuQ2LcanxA";
  static const String clientKey = "lqbSNeCi0zxXrM8YNRWkDuloceLuuQvjgT1QvgBO";
  static const String masterKey = "so3ab7BRbfhSV2WjdWFNMHq7fYHeNoOehxyIPWr8";


  //App Theme Color
  static Color primaryRed = const Color(0xFFD32F2F);
  static Color lightRed = const Color(0xFFFFEBEE);
}
