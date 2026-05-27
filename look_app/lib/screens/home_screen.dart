import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/favorites_provider.dart';
import 'auth_screen.dart';
import 'catalog_screen.dart';
import 'favorites_screen.dart';
import 'upload_screen.dart';
import 'cart_screen.dart';
import 'contact_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  static const _destinations = <({IconData icon, IconData activeIcon, String label})>[
    (icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Inicio'),
    (icon: Icons.explore_outlined, activeIcon: Icons.explore, label: 'Explorar'),
    (icon: Icons.auto_awesome_outlined, activeIcon: Icons.auto_awesome, label: 'IA'),
    (icon: Icons.favorite_outline, activeIcon: Icons.favorite, label: 'Favoritos'),
    (icon: Icons.person_outline, activeIcon: Icons.person, label: 'Perfil'),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) return const AuthScreen();

    final cartProvider = context.watch<CartProvider>();
    final theme = Theme.of(context);

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: [
          const CatalogScreen(),
          const CatalogScreen(),
          const UploadScreen(),
          const FavoritesScreen(),
          const ContactScreen(),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: theme.colorScheme.outlineVariant, width: 0.5)),
        ),
        child: NavigationBar(
          selectedIndex: _currentIndex,
          onDestinationSelected: (index) => setState(() => _currentIndex = index),
          backgroundColor: theme.scaffoldBackgroundColor,
          destinations: [
            for (var i = 0; i < _destinations.length; i++)
              NavigationDestination(
                icon: Icon(_destinations[i].icon),
                selectedIcon: Icon(_destinations[i].activeIcon),
                label: _destinations[i].label,
              ),
          ],
        ),
      ),
    );
  }
}
