import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/products_data.dart';
import '../models/product.dart';
import '../providers/auth_provider.dart';
import '../providers/cart_provider.dart';
import '../widgets/product_card.dart';
import '../widgets/category_card.dart';
import '../widgets/auth_gate.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  String _currentFilter = 'todas';
  final _searchCtrl = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  List<Product> get _filteredProducts {
    return allProducts.where((p) {
      final matchesFilter =
          _currentFilter == 'todas' || p.category.name == _currentFilter;
      final matchesSearch = _searchQuery.isEmpty ||
          p.name.toLowerCase().contains(_searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) {
      return const AuthGate(
        title: 'Regístrate para ver productos',
        subtitle: 'Crea una cuenta o inicia sesión para acceder al catálogo.',
      );
    }

    final cart = context.watch<CartProvider>();
    final filtered = _filteredProducts;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Hero section
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(28),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'La moda que quieres,\nal alcance de tu mano',
                  style: Theme.of(context)
                      .textTheme
                      .headlineSmall
                      ?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w800,
                        height: 1.15,
                      ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Vende y compra ropa. Dale una segunda vida a tu armario.',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Colors.white.withValues(alpha: 0.9),
                      ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Search bar
          TextField(
            controller: _searchCtrl,
            decoration: InputDecoration(
              hintText: 'Buscar prendas...',
              prefixIcon: const Icon(Icons.search),
              suffixIcon: _searchQuery.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () {
                        _searchCtrl.clear();
                        setState(() => _searchQuery = '');
                      },
                    )
                  : null,
            ),
            onChanged: (v) => setState(() => _searchQuery = v),
          ),

          const SizedBox(height: 20),

          // Categories
          Text(
            'Categorías',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                ),
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 100,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final cat = categories[index];
                return CategoryCard(
                  icon: _categoryIcon(cat['icon'] as String),
                  name: cat['name'] as String,
                  isActive: _currentFilter == cat['filter'],
                  onTap: () {
                    setState(() => _currentFilter = cat['filter'] as String);
                  },
                );
              },
            ),
          ),

          const SizedBox(height: 28),

          // Catalog header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Catálogo',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox.shrink(),
            ],
          ),

          const SizedBox(height: 8),

          // Filter tabs
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('Todas', 'todas'),
                const SizedBox(width: 8),
                _buildFilterChip('Mujer', 'mujer'),
                const SizedBox(width: 8),
                _buildFilterChip('Hombre', 'hombre'),
                const SizedBox(width: 8),
                _buildFilterChip('Accesorios', 'accesorios'),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Products grid
          if (filtered.isEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 48),
              child: Center(
                child: Text(
                  'No hay productos con esos criterios',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                        color: Theme.of(context)
                            .colorScheme
                            .onSurface
                            .withValues(alpha: 0.5),
                      ),
                ),
              ),
            )
          else
            LayoutBuilder(
              builder: (context, constraints) {
                final crossAxisCount = constraints.maxWidth > 600 ? 3 : 2;
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossAxisCount,
                    childAspectRatio: 0.62,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                  ),
                  itemCount: filtered.length,
                  itemBuilder: (context, index) {
                    final product = filtered[index];
                    return GestureDetector(
                      onTap: () => Navigator.pushNamed(
                        context,
                        '/product/${product.id}',
                      ),
                      child: ProductCard(
                        product: product,
                        inCart: cart.isInCart(product.id),
                        onToggleCart: () => cart.toggleItem(product),
                      ),
                    );
                  },
                );
              },
            ),
        ],
      ),
    );
  }

  IconData _categoryIcon(String name) {
    switch (name) {
      case 'woman':
        return Icons.woman_outlined;
      case 'man':
        return Icons.man_outlined;
      case 'watch':
        return Icons.watch_outlined;
      case 'apps':
        return Icons.apps_outlined;
      default:
        return Icons.apps_outlined;
    }
  }

  Widget _buildFilterChip(String label, String value) {
    final isActive = _currentFilter == value;
    return FilterChip(
      label: Text(label),
      selected: isActive,
      onSelected: (_) => setState(() => _currentFilter = value),
      showCheckmark: false,
    );
  }
}
