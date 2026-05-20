import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/products_data.dart';
import '../models/product.dart';
import '../models/user.dart';
import '../providers/cart_provider.dart';
import '../providers/chat_provider.dart';
import '../providers/follow_provider.dart';
import '../widgets/product_card.dart';

const Map<int, Map<String, dynamic>> _sellerData = {
  1: {
    'name': 'María García',
    'avatar': 'woman',
    'rating': 4.8,
    'joinDate': 'Enero 2024',
    'productsCount': 5,
    'salesCount': 23,
    'bio':
        'Apasionada de la moda sustentable. Vendo ropa de calidad que ya no uso para darle una segunda oportunidad.',
  },
  2: {
    'name': 'Carlos López',
    'avatar': 'man',
    'rating': 4.5,
    'joinDate': 'Marzo 2024',
    'productsCount': 3,
    'salesCount': 12,
    'bio':
        'Vendo ropa en excelente estado. Todo cuidado con mucho cariño.',
  },
};

const Map<int, String> _defaultSellers = {
  1: 'Vendedora',
  2: 'Vendedor',
};

class SellerProfileScreen extends StatelessWidget {
  final int sellerId;

  const SellerProfileScreen({super.key, required this.sellerId});

  Map<String, dynamic> get _info =>
      _sellerData[sellerId] ??
      {
        'name': _defaultSellers[sellerId] ?? 'Vendedor',
        'avatar': 'person',
        'rating': 0.0,
        'joinDate': 'Desconocido',
        'productsCount': 0,
        'salesCount': 0,
        'bio': '',
      };

  List<Product> get _products =>
      allProducts.where((p) => p.sellerId == sellerId).toList();

  @override
  Widget build(BuildContext context) {
    final info = _info;
    final products = _products;
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;
    final follow = context.watch<FollowProvider>();
    final chat = context.read<ChatProvider>();
    final isFollowing = follow.isFollowing(sellerId);

    return Scaffold(
      appBar: AppBar(
        title: Text(info['name'] as String),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Center(
            child: Column(
              children: [
                CircleAvatar(
                  radius: 48,
                  backgroundColor: colorScheme.surfaceContainerHighest,
                  child: Icon(
                    userIcon(info['avatar'] as String),
                    size: 48,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  info['name'] as String,
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ...List.generate(
                      5,
                      (i) => Icon(
                        i < (info['rating'] as double).floor()
                            ? Icons.star
                            : Icons.star_outline,
                        color: Colors.amber,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      info['rating'].toStringAsFixed(1),
                      style: theme.textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Miembro desde ${info['joinDate']}',
                  style: theme.textTheme.bodySmall?.copyWith(
                    color: colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              _StatItem(
                value: '${info['productsCount']}',
                label: 'Productos',
              ),
              _StatItem(
                value: '${info['salesCount']}',
                label: 'Ventas',
              ),
              _StatItem(
                value: info['rating'].toStringAsFixed(1),
                label: 'Rating',
              ),
            ],
          ),
          if ((info['bio'] as String).isNotEmpty) ...[
            const SizedBox(height: 24),
            Text(
              info['bio'] as String,
              style: theme.textTheme.bodyLarge?.copyWith(
                color: colorScheme.onSurface.withValues(alpha: 0.7),
              ),
              textAlign: TextAlign.center,
            ),
          ],
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: FilledButton.icon(
                  onPressed: () {
                    chat.startConversation(
                      sellerId,
                      info['name'] as String,
                      partnerAvatar: info['avatar'] as String,
                    );
                    Navigator.pushNamed(context, '/chat');
                  },
                  icon: const Icon(Icons.chat_outlined),
                  label: const Text('Contactar'),
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(0, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: FilledButton.icon(
                  onPressed: () => follow.toggle(sellerId),
                  icon: Icon(
                    isFollowing ? Icons.person_remove : Icons.person_add,
                  ),
                  label: Text(isFollowing ? 'Siguiendo' : 'Seguir'),
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(0, 48),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ],
          ),
          if (products.isNotEmpty) ...[
            const SizedBox(height: 32),
            Text(
              'Productos',
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.62,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: products.length,
              itemBuilder: (context, index) {
                final product = products[index];
                final cart = context.watch<CartProvider>();
                return ProductCard(
                  product: product,
                  inCart: cart.isInCart(product.id),
                  onToggleCart: () => cart.toggleItem(product),
                );
              },
            ),
          ],
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;

  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: theme.colorScheme.surfaceContainerHighest.withValues(alpha: 0.5),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: theme.textTheme.titleLarge?.copyWith(
                fontWeight: FontWeight.w800,
                color: theme.colorScheme.primary,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: theme.textTheme.bodySmall?.copyWith(
                color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
