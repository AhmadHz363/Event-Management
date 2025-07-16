import 'package:flutter/material.dart';
import 'package:frontend_2/app.dart';
import 'package:parse_server_sdk_flutter/parse_server_sdk_flutter.dart';
import 'Configs/global_configs.dart';

Future<void> main() async {
    WidgetsFlutterBinding.ensureInitialized();
   await Parse().initialize(
    Config.appId,
    Config.serverUrl,
    clientKey: Config.clientKey,
    autoSendSessionId: true,
    debug: Config.isDebug,
    appName: Config.appName,
    appPackageName: Config.packageName,
    appVersion: Config.appVersion,
    masterKey: Config.masterKey
  );
    debugPrint("==== APP STARTED ====");
  runApp(const App());
}

