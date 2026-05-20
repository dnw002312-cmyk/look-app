import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/products_data.dart';
import '../models/product.dart';
import '../models/user.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../providers/favorites_provider.dart';
import '../widgets/auth_gate.dart';

class ProductDetailScreen extends StatelessWidget {
  final Product? product;
  final int? productId;

  const ProductDetailScreen({
    super.key,
    this.product,
    this.productId,
  }) : assert(product != null || productId != null);

  Product get _product {
    if (product != null) return product!;
    return allProducts.firstWhere((p) => p.id == productId);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) {
      return Scaffold(
        appBar: AppBar(leading: const BackButton()),
        body: const AuthGate(
          title: 'Inicia sesión para ver detalles',
          subtitle: 'Crea una cuenta o inicia sesión para ver la información completa del producto.',
        ),
      );
    }

    final theme = Theme.of(context);
    final cs = theme.colorScheme;
    final cart = context.watch<CartProvider>();
    final favs = context.watch<FavoritesProvider>();

    return Scaffold(
      appBar: AppBar(
        leading: const BackButton(),
        actions: [
          IconButton(
            icon: Icon(
              favs.isFavorite(_product.id)
                  ? Icons.favorite
                  : Icons.favorite_outline,
              color: favs.isFavorite(_product.id) ? Colors.red : null,
            ),
            onPressed: () => favs.toggle(_product.id),
          ),
        ],
      ),
      body: ListView(
        children: [
          Container(
            height: 280,
            width: double.infinity,
            color: cs.surfaceContainerHighest,
            child: Center(
              child: Icon(productIcon(_product.icon), size: 100),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _product.name,
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '\u20A1${_product.price.toStringAsFixed(0)}',
                  style: theme.textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: cs.primary,
                  ),
                ),
                const SizedBox(height: 20),
                _buildDetailRow(Icons.straighten, 'Talla', _product.size),
                _buildDetailRow(
                  Icons.palette_outlined,
                  'Color',
                  _product.color,
                ),
                _buildDetailRow(
                  Icons.branding_watermark,
                  'Marca',
                  _product.brand,
                ),
                _buildDetailRow(
                  Icons.check_circle_outline,
                  'Estado',
                  _product.conditionLabel,
                ),
                if (_product.description != null) ...[
                  const SizedBox(height: 20),
                  Text(
                    'Descripción',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    _product.description!,
                    style: theme.textTheme.bodyMedium?.copyWith(
                      color: cs.onSurface.withValues(alpha: 0.7),
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                Card(
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: cs.surfaceContainerHighest,
                      child: Icon(userIcon(_product.sellerPhoto), size: 28),
                    ),
                    title: Text(
                      _product.sellerName,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    subtitle: _product.sellerSince != null
                        ? Text('Miembro desde ${_product.sellerSince}')
                        : null,
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () {
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          title: Text(_product.sellerName),
                          content: const Text(
                            'Puedes contactar al vendedor para más información sobre este producto.',
                          ),
                          actions: [
                            FilledButton(
                              onPressed: () => Navigator.pop(ctx),
                              child: const Text('Contactar'),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(height: 24),
                FilledButton.icon(
                  onPressed: () => cart.toggleItem(_product),
                  icon: Icon(
                    cart.isInCart(_product.id) ? Icons.check : Icons.shopping_bag,
                  ),
                  label: Text(
                    cart.isInCart(_product.id) ? '✓ En carrito' : 'Agregar al carrito',
                  ),
                  style: FilledButton.styleFrom(
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                OutlinedButton.icon(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Mensaje enviado al vendedor'),
                      ),
                    );
                  },
                  icon: const Icon(Icons.mail_outline),
                  label: const Text('Contactar vendedor'),
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(double.infinity, 52),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String? value) {
    if (value == null || value.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        children: [
          Icon(icon, size: 20),
          const SizedBox(width: 12),
          Text('$label: ', style: const TextStyle(fontWeight: FontWeight.w600)),
          Text(value),
        ],
      ),
    );
  }
}
