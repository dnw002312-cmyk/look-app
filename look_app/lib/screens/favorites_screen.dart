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
    final favProducts =
        allProducts.where((p) => favorites.isFavorite(p.id)).toList();

    if (favProducts.isEmpty) {
      return Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.favorite_outlined,
                size: 48,
                color: Theme.of(context)
                    .colorScheme
                    .onSurface
                    .withValues(alpha: 0.3)),
            const SizedBox(height: 16),
            Text(
              'No tienes favoritos aún',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: Theme.of(context)
                        .colorScheme
                        .onSurface
                        .withValues(alpha: 0.5),
                  ),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
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
    );
  }
}
