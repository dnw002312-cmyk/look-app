import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'providers/cart_provider.dart';
import 'providers/theme_provider.dart';
import 'providers/auth_provider.dart';
import 'providers/favorites_provider.dart';
import 'providers/follow_provider.dart';
import 'providers/chat_provider.dart';
import 'services/api_service.dart';
import 'app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString('look_token');
  ApiService.setToken(token);

  final auth = AuthProvider();
  final cart = CartProvider();
  final favorites = FavoritesProvider();
  final follow = FollowProvider();
  final chat = ChatProvider();

  await auth.loadFromPrefs();

  if (auth.isLoggedIn) {
    await Future.wait([
      cart.load(),
      favorites.load(),
      follow.load(),
      chat.load(),
    ]);
  }

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider.value(value: cart),
        ChangeNotifierProvider(create: (_) => ThemeProvider()),
        ChangeNotifierProvider.value(value: favorites),
        ChangeNotifierProvider.value(value: follow),
        ChangeNotifierProvider.value(value: chat),
      ],
      child: const LookApp(),
    ),
  );
}
