import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/products_data.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/favorites_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/auth_gate.dart';

class FavoritesScreen extends StatelessWidget {
  const FavoritesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) {
      return const AuthGate(
        title: 'Inicia sesión para ver tus favoritos',
        subtitle: 'Crea una cuenta o inicia sesión para guardar y gestionar tus productos favoritos.',
      );
    }

    final favorites = context.watch<FavoritesProvider>();
    final cart = context.watch<CartProvider>();
    final theme = Theme.of(context);
    final cs = theme.colorScheme;
    final favProducts =
        allProducts.where((p) => favorites.isFavorite(p.id)).toList();

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Favoritos',
          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
        ),
      ),
      body: favProducts.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: cs.secondary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Icon(
                      Icons.favorite_outline,
                      size: 36,
                      color: cs.secondary,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'No tienes favoritos aún',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Toca el corazón en los productos que te gusten',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: cs.onSurface.withValues(alpha: 0.5),
                    ),
                  ),
                ],
              ),
            )
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${favProducts.length} ${favProducts.length == 1 ? 'prenda guardada' : 'prendas guardadas'}',
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: cs.onSurface.withValues(alpha: 0.6),
                    ),
                  ),
                  const SizedBox(height: 16),
                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      childAspectRatio: 0.62,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                    ),
                    itemCount: favProducts.length,
                    itemBuilder: (context, index) {
                      final product = favProducts[index];
                      return ProductCard(
                        product: product,
                        inCart: cart.isInCart(product.id),
                        onToggleCart: () => cart.toggleItem(product),
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }
}
