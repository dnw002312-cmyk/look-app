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
          return MaterialPageRoute(builder: (_) => const HomeScreen());
        }
        if (settings.name == '/chat') {
          return MaterialPageRoute(builder: (_) => const ChatScreen());
        }
        if (settings.name == '/upload') {
          return MaterialPageRoute(builder: (_) => const UploadScreen());
        }
        if (segments.length == 2 && segments[0] == 'product') {
          final id = int.tryParse(segments[1]);
          if (id != null) {
            return MaterialPageRoute(builder: (_) => ProductDetailScreen(productId: id));
          }
        }
        if (segments.length == 2 && segments[0] == 'seller') {
          final id = int.tryParse(segments[1]);
          if (id != null) {
            return MaterialPageRoute(builder: (_) => SellerProfileScreen(sellerId: id));
          }
        }
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      },
    );
  }

  ThemeData _buildTheme() {
    const brand = Color(0xFF6BB58C);
    const ink = Color(0xFF0D2340);
    const background = Color(0xFFFCFCFD);
    const surface = Color(0xFFFFFFFF);
    const muted = Color(0xFFF4F4F6);
    const border = Color(0xFFEAEAEC);
    const mutedFg = Color(0xFF7C7C8A);

    final colorScheme = ColorScheme.fromSeed(
      seedColor: brand,
      brightness: Brightness.light,
    ).copyWith(
      primary: ink,
      onPrimary: const Color(0xFFFCFCFD),
      secondary: brand,
      onSecondary: ink,
      surface: surface,
      onSurface: ink,
      surfaceContainerHighest: muted,
      outline: border,
      outlineVariant: border,
    );

    const textStyle = TextStyle(fontFamily: 'sans-serif');
    final textTheme = TextTheme(
      displayLarge: textStyle.copyWith(fontSize: 32, fontWeight: FontWeight.w800, color: ink, letterSpacing: -0.5),
      displayMedium: textStyle.copyWith(fontSize: 28, fontWeight: FontWeight.w700, color: ink),
      displaySmall: textStyle.copyWith(fontSize: 24, fontWeight: FontWeight.w700, color: ink),
      headlineLarge: textStyle.copyWith(fontSize: 22, fontWeight: FontWeight.w800, color: ink, letterSpacing: -0.5),
      headlineMedium: textStyle.copyWith(fontSize: 20, fontWeight: FontWeight.w700, color: ink),
      headlineSmall: textStyle.copyWith(fontSize: 18, fontWeight: FontWeight.w700, color: ink),
      titleLarge: textStyle.copyWith(fontSize: 18, fontWeight: FontWeight.w700, color: ink),
      titleMedium: textStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w600, color: ink),
      titleSmall: textStyle.copyWith(fontSize: 14, fontWeight: FontWeight.w600, color: ink),
      bodyLarge: textStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w500, color: ink),
      bodyMedium: textStyle.copyWith(fontSize: 14, fontWeight: FontWeight.w500, color: ink),
      bodySmall: textStyle.copyWith(fontSize: 12, fontWeight: FontWeight.w500, color: ink),
      labelLarge: textStyle.copyWith(fontSize: 14, fontWeight: FontWeight.w600, color: ink),
      labelMedium: textStyle.copyWith(fontSize: 12, fontWeight: FontWeight.w600, color: ink),
      labelSmall: textStyle.copyWith(fontSize: 10, fontWeight: FontWeight.w600, color: mutedFg, letterSpacing: 0.5),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: background,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        centerTitle: false,
        elevation: 0,
        scrolledUnderElevation: 0,
        backgroundColor: background,
        foregroundColor: ink,
        titleTextStyle: textStyle.copyWith(fontSize: 20, fontWeight: FontWeight.w800, color: ink, letterSpacing: -0.5),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: muted,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: brand, width: 1.5),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A)),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: Color(0xFFBA1A1A), width: 1.5),
        ),
        labelStyle: textStyle.copyWith(fontSize: 14, fontWeight: FontWeight.w500, color: mutedFg),
        hintStyle: textStyle.copyWith(fontSize: 14, fontWeight: FontWeight.w500, color: mutedFg),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: ink,
          foregroundColor: const Color(0xFFFCFCFD),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: textStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w700),
          minimumSize: const Size(double.infinity, 52),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: ink,
          side: const BorderSide(color: border, width: 1.5),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: textStyle.copyWith(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: brand,
          foregroundColor: ink,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          textStyle: textStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w700),
          elevation: 0,
        ),
      ),
      chipTheme: ChipThemeData(
        backgroundColor: muted,
        selectedColor: const Color(0xFFE8F5EE),
        labelStyle: textStyle.copyWith(fontSize: 13, fontWeight: FontWeight.w600, color: ink),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        side: const BorderSide(color: border),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      ),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: background,
        elevation: 0,
        shadowColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        indicatorColor: brand.withValues(alpha: 0.15),
        labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
        height: 64,
        labelTextStyle: WidgetStatePropertyAll(
          textStyle.copyWith(fontSize: 11, fontWeight: FontWeight.w600),
        ),
        iconTheme: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return const IconThemeData(color: ink, size: 24);
          }
          return IconThemeData(color: mutedFg, size: 24);
        }),
      ),
      bottomSheetTheme: const BottomSheetThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
      ),
      dialogTheme: const DialogThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(20))),
      ),
    );
  }
}
