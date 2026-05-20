import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/chat_screen.dart';
import 'screens/seller_profile_screen.dart';
import 'screens/upload_screen.dart';
import 'screens/product_detail_screen.dart';

class LookApp extends StatelessWidget {
  const LookApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LOOK',
      debugShowCheckedModeBanner: false,
      theme: _buildTheme(),
      initialRoute: '/',
      onGenerateRoute: (settings) {
        final uri = Uri.parse(settings.name ?? '/');
        final segments = uri.pathSegments;

        if (settings.name == '/' || settings.name == null) {
          return MaterialPageRoute(
            builder: (_) => const HomeScreen(),
          );
        }

        if (settings.name == '/chat') {
          return MaterialPageRoute(
            builder: (_) => const ChatScreen(),
          );
        }

        if (settings.name == '/upload') {
          return MaterialPageRoute(
            builder: (_) => const UploadScreen(),
          );
        }

        if (segments.length == 2 && segments[0] == 'product') {
          final id = int.tryParse(segments[1]);
          if (id != null) {
            return MaterialPageRoute(
              builder: (_) => ProductDetailScreen(productId: id),
            );
          }
        }

        if (segments.length == 2 && segments[0] == 'seller') {
          final id = int.tryParse(segments[1]);
          if (id != null) {
            return MaterialPageRoute(
              builder: (_) => SellerProfileScreen(sellerId: id),
            );
          }
        }

        return MaterialPageRoute(builder: (_) => const HomeScreen());
      },
    );
  }

  ThemeData _buildTheme() {
    const primary = Color(0xFF3860BE);
    const canvasWhite = Color(0xFFFFFFFF);
    const inkBlack = Color(0xFF000000);
    const hintOfGray = Color(0xFFEAEAE8);
    const bodyTextGray = Color(0xFF767676);
    const softGraphite = Color(0xFF666666);

    final colorScheme = ColorScheme.fromSeed(
      seedColor: primary,
      brightness: Brightness.light,
    ).copyWith(
      onSurface: inkBlack,
      onSurfaceVariant: bodyTextGray,
    );

    final textTheme = TextTheme(
      displayLarge: TextStyle(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      displayMedium: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      headlineLarge: TextStyle(
        fontSize: 22,
        fontWeight: FontWeight.w600,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      headlineMedium: TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      titleLarge: TextStyle(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      titleMedium: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w500,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      titleSmall: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      bodyLarge: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      bodyMedium: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      bodySmall: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      labelLarge: TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      labelMedium: TextStyle(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
      labelSmall: TextStyle(
        fontSize: 10,
        fontWeight: FontWeight.w500,
        color: inkBlack,
        fontFamily: 'monospace',
      ),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: canvasWhite,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        centerTitle: true,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: canvasWhite,
        foregroundColor: inkBlack,
        titleTextStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: inkBlack,
          fontFamily: 'monospace',
        ),
      ),
      cardTheme: const CardThemeData(
        color: Color(0xFFFFFFFF),
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.zero,
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: canvasWhite,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: hintOfGray),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: hintOfGray),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: primary, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A)),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A), width: 2),
        ),
        labelStyle: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: bodyTextGray,
          fontFamily: 'monospace',
        ),
        hintStyle: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          color: softGraphite,
          fontFamily: 'monospace',
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(2),
          ),
          textStyle: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            fontFamily: 'monospace',
          ),
        ),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: canvasWhite,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        indicatorColor: primary.withValues(alpha: 0.12),
        labelTextStyle: WidgetStatePropertyAll(
          TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w500,
            fontFamily: 'monospace',
          ),
        ),
      ),
    );
  }
}
