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
    final theme = Theme.of(context);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            floating: true,
            backgroundColor: theme.scaffoldBackgroundColor,
            title: RichText(
              text: TextSpan(
                style: theme.textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w800,
                  letterSpacing: -0.5,
                ),
                children: [
                  const TextSpan(text: 'LOOK'),
                  TextSpan(
                    text: '.',
                    style: TextStyle(color: theme.colorScheme.secondary),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // Search
                Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    color: theme.colorScheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: TextField(
                    controller: _searchCtrl,
                    style: theme.textTheme.bodyMedium,
                    decoration: InputDecoration(
                      hintText: 'Buscar marca, talla, estilo...',
                      hintStyle: theme.textTheme.bodyMedium?.copyWith(
                        color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                      ),
                      prefixIcon: const Icon(Icons.search, size: 20),
                      suffixIcon: _searchQuery.isNotEmpty
                          ? IconButton(
                              icon: const Icon(Icons.clear, size: 20),
                              onPressed: () {
                                _searchCtrl.clear();
                                setState(() => _searchQuery = '');
                              },
                            )
                          : null,
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    ),
                    onChanged: (v) => setState(() => _searchQuery = v),
                  ),
                ),

                // Categories
                Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Text(
                    'Categorías',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w800,
                      letterSpacing: -0.5,
                    ),
                  ),
                ),
                SizedBox(
                  height: 88,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: categories.length,
                    separatorBuilder: (_, __) => const SizedBox(width: 10),
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

                const SizedBox(height: 16),

                // IA Stylist card
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        theme.colorScheme.primary,
                        const Color(0xFF1A3356),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.auto_awesome, size: 14, color: Colors.white),
                            SizedBox(width: 4),
                            Text('IA Stylist', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        'Tu drop semanal está listo',
                        style: theme.textTheme.titleMedium?.copyWith(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '12 piezas curadas para tu estilo.',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: Colors.white.withValues(alpha: 0.7),
                        ),
                      ),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: () {},
                        style: ElevatedButton.styleFrom(
                          backgroundColor: theme.colorScheme.secondary,
                          foregroundColor: theme.colorScheme.primary,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                        ),
                        child: Text(
                          'Ver selección',
                          style: theme.textTheme.labelLarge?.copyWith(fontWeight: FontWeight.w700),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 24),

                // Header
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Recomendado para ti',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.w800,
                        letterSpacing: -0.5,
                      ),
                    ),
                    Text(
                      'Ver todo',
                      style: theme.textTheme.labelMedium?.copyWith(
                        color: theme.colorScheme.secondary,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Basado en tu estilo',
                  style: theme.textTheme.bodySmall,
                ),

                const SizedBox(height: 16),

                // Filter chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 16),
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
                ),
              ]),
            ),
          ),

          // Products grid
          if (filtered.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Text(
                  'No hay productos con esos criterios',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.62,
                  crossAxisSpacing: 10,
                  mainAxisSpacing: 10,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
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
                  childCount: filtered.length,
                ),
              ),
            ),

          const SliverPadding(padding: EdgeInsets.only(bottom: 24)),
        ],
      ),
    );
  }

  IconData _categoryIcon(String name) {
    switch (name) {
      case 'woman':
        return Icons.woman_2_outlined;
      case 'man':
        return Icons.man_2_outlined;
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
    final theme = Theme.of(context);
    return FilterChip(
      label: Text(label),
      selected: isActive,
      onSelected: (_) => setState(() => _currentFilter = value),
      showCheckmark: false,
      backgroundColor: theme.colorScheme.surfaceContainerHighest,
      selectedColor: isActive ? const Color(0xFFE8F5EE) : theme.colorScheme.surfaceContainerHighest,
      labelStyle: theme.textTheme.labelMedium?.copyWith(
        color: isActive ? theme.colorScheme.primary : theme.colorScheme.onSurface.withValues(alpha: 0.6),
        fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
      ),
      side: isActive
          ? BorderSide(color: theme.colorScheme.secondary.withValues(alpha: 0.5))
          : BorderSide(color: theme.colorScheme.outline.withValues(alpha: 0.3)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
    );
  }
}
