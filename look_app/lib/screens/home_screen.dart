import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
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

  final List<Widget> _screens = [
    const CatalogScreen(),
    const FavoritesScreen(),
    const UploadScreen(),
    const CartScreen(),
    const ContactScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) return const AuthScreen();

    final cartProvider = context.watch<CartProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('LOOK'),
        actions: [
          if (auth.isLoggedIn)
            IconButton(
              icon: const Icon(Icons.logout),
              onPressed: () => auth.logout(),
              tooltip: 'Cerrar sesión',
            ),
        ],
      ),
      body: _screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.storefront_outlined),
            selectedIcon: Icon(Icons.storefront),
            label: 'Catálogo',
          ),
          const NavigationDestination(
            icon: Icon(Icons.favorite_outline),
            selectedIcon: Icon(Icons.favorite),
            label: 'Favoritos',
          ),
          const NavigationDestination(
            icon: Icon(Icons.add_circle_outline),
            selectedIcon: Icon(Icons.add_circle),
            label: 'Subir',
          ),
          NavigationDestination(
            icon: Badge(
              isLabelVisible: cartProvider.itemCount > 0,
              label: Text('${cartProvider.itemCount}'),
              child: const Icon(Icons.shopping_cart_outlined),
            ),
            selectedIcon: Badge(
              isLabelVisible: cartProvider.itemCount > 0,
              label: Text('${cartProvider.itemCount}'),
              child: const Icon(Icons.shopping_cart),
            ),
            label: 'Carrito',
          ),
          const NavigationDestination(
            icon: Icon(Icons.mail_outline),
            selectedIcon: Icon(Icons.mail),
            label: 'Contacto',
          ),
        ],
      ),
    );
  }
}
