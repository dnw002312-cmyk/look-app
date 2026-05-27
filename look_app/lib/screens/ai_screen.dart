import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AiScreen extends StatefulWidget {
  const AiScreen({super.key});

  @override
  State<AiScreen> createState() => _AiScreenState();
}

class _AiScreenState extends State<AiScreen> {
  bool _loading = false;
  String? _activeVibe;
  List<AiOutfit> _outfits = [];
  String? _error;

  static const _vibes = <_Vibe>[
    _Vibe(id: 'casual', label: 'Casual del día', emoji: '👕'),
    _Vibe(id: 'concierto', label: 'Outfit concierto', emoji: '🎤'),
    _Vibe(id: 'vintage', label: 'Vintage vibes', emoji: '🕰️'),
    _Vibe(id: 'minimal', label: 'Minimal clean', emoji: '🤍'),
    _Vibe(id: 'streetwear', label: 'Streetwear combo', emoji: '🧢'),
    _Vibe(id: 'elegante', label: 'Elegante noche', emoji: '🖤'),
  ];

  Future<void> _generate(String vibe, String label) async {
    setState(() {
      _loading = true;
      _error = null;
      _activeVibe = vibe;
      _outfits = [];
    });

    try {
      final data = await ApiService.getAiOutfits(
        vibe: label,
        styles: ['casual', 'vintage', 'minimalista'],
        sizes: {'top': 'M', 'bottom': 'M', 'shoes': '40'},
      );
      final raw = data['outfits'] as List<dynamic>? ?? [];
      final outfits = raw.map((o) => AiOutfit(
        title: o['title'] as String? ?? '',
        description: o['description'] as String? ?? '',
        items: (o['items'] as List<dynamic>? ?? []).map((i) => AiOutfitItem(
          type: i['type'] as String? ?? '',
          name: i['name'] as String? ?? '',
          brand: i['brand'] as String? ?? '',
          price: (i['price'] as num?)?.toInt() ?? 0,
          color: i['color'] as String? ?? '',
          why: i['why'] as String? ?? '',
        )).toList(),
        totalPrice: (o['totalPrice'] as num?)?.toInt() ?? 0,
        tags: (o['tags'] as List<dynamic>? ?? []).map((t) => t as String).toList(),
      )).toList();

      if (!mounted) return;
      setState(() {
        _outfits = outfits;
        _loading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString().contains('API key')
            ? 'Gemini no configurado. Pide al admin que ponga la API key en backend/.env'
            : 'No se pudo generar el look: ${e.toString().split('\n').first}';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    const brand = Color(0xFF6BB58C);
    const ink = Color(0xFF0D2340);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            floating: true,
            backgroundColor: theme.scaffoldBackgroundColor,
            title: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: brand.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: const Text(
                    '✨ LOOK IA',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: ink),
                  ),
                ),
              ],
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                Text(
                  'Tu guía de estilo IA',
                  style: theme.textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Outfits generados por Gemini con piezas reales de segunda mano',
                  style: theme.textTheme.bodyMedium?.copyWith(
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
                ),
                const SizedBox(height: 24),
                Text(
                  'Elige tu vibe',
                  style: theme.textTheme.labelMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1,
                    color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                  ),
                ),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: _vibes.map((v) {
                    final isActive = _activeVibe == v.id;
                    return GestureDetector(
                      onTap: _loading ? null : () => _generate(v.id, v.label),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        decoration: BoxDecoration(
                          color: isActive ? brand.withValues(alpha: 0.1) : theme.colorScheme.surfaceContainerHighest,
                          borderRadius: BorderRadius.circular(16),
                          border: isActive ? Border.all(color: brand) : null,
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(v.emoji, style: const TextStyle(fontSize: 20)),
                            const SizedBox(width: 8),
                            Text(
                              v.label,
                              style: TextStyle(
                                fontWeight: FontWeight.w700,
                                color: isActive ? brand : theme.colorScheme.onSurface,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 28),

                // Loading
                if (_loading) ...[
                  Container(
                    padding: const EdgeInsets.all(40),
                    decoration: BoxDecoration(
                      color: theme.colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 56,
                          height: 56,
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(colors: [brand, Color(0xFF5AA97A)]),
                            borderRadius: BorderRadius.all(Radius.circular(16)),
                          ),
                          child: const Padding(
                            padding: EdgeInsets.all(14),
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Gemini está creando tu selección...',
                          style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'La IA está combinando piezas para ti',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Error
                if (_error != null && !_loading) ...[
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.red.withValues(alpha: 0.2)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.error_outline, color: Colors.red, size: 20),
                        const SizedBox(width: 10),
                        Expanded(child: Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13))),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Empty state
                if (!_loading && _outfits.isEmpty && _error == null) ...[
                  Container(
                    padding: const EdgeInsets.all(32),
                    decoration: BoxDecoration(
                      border: Border.all(color: theme.colorScheme.outlineVariant),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      children: [
                        Container(
                          width: 56,
                          height: 56,
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(colors: [brand, Color(0xFF5AA97A)]),
                            borderRadius: BorderRadius.all(Radius.circular(16)),
                          ),
                          child: const Icon(Icons.auto_awesome, color: Colors.white, size: 28),
                        ),
                        const SizedBox(height: 12),
                        Text(
                          'Selecciona un vibe',
                          style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Gemini te montará 4 outfits completos',
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                ],

                // Outfit cards
                ..._outfits.map((o) => _OutfitCard(outfit: o)),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _Vibe {
  final String id;
  final String label;
  final String emoji;
  const _Vibe({required this.id, required this.label, required this.emoji});
}

class AiOutfit {
  final String title;
  final String description;
  final List<AiOutfitItem> items;
  final int totalPrice;
  final List<String> tags;
  AiOutfit({
    required this.title,
    required this.description,
    required this.items,
    required this.totalPrice,
    required this.tags,
  });
}

class AiOutfitItem {
  final String type;
  final String name;
  final String brand;
  final int price;
  final String color;
  final String why;
  AiOutfitItem({
    required this.type,
    required this.name,
    required this.brand,
    required this.price,
    required this.color,
    required this.why,
  });
}

class _OutfitCard extends StatelessWidget {
  final AiOutfit outfit;
  const _OutfitCard({required this.outfit});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    const ink = Color(0xFF0D2340);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: theme.colorScheme.outlineVariant),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(18),
            decoration: const BoxDecoration(
              gradient: LinearGradient(colors: [ink, Color(0xFF1A3356)]),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.auto_awesome, size: 12, color: Colors.white),
                          SizedBox(width: 4),
                          Text('Look IA', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                        ],
                      ),
                    ),
                    Text('₡${outfit.totalPrice}', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Colors.white)),
                  ],
                ),
                const SizedBox(height: 10),
                Text(outfit.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: Colors.white)),
                const SizedBox(height: 4),
                Text(outfit.description, style: TextStyle(fontSize: 13, color: Colors.white.withValues(alpha: 0.7))),
                if (outfit.tags.isNotEmpty) ...[
                  const SizedBox(height: 10),
                  Wrap(
                    spacing: 6,
                    children: outfit.tags.map((t) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: const Color(0xFF6BB58C).withValues(alpha: 0.3), borderRadius: BorderRadius.circular(20)),
                      child: Text('#$t', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: Colors.white)),
                    )).toList(),
                  ),
                ],
              ],
            ),
          ),
          ...outfit.items.map((item) => Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(border: Border(bottom: BorderSide(color: theme.colorScheme.outlineVariant))),
            child: Row(
              children: [
                Container(
                  width: 44, height: 44,
                  decoration: BoxDecoration(color: const Color(0xFF6BB58C).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(14)),
                  child: Icon(
                    item.type == 'Shoes' ? Icons.hiking : item.type == 'Bottom' ? Icons.straighten : item.type == 'Accesorio' ? Icons.watch : Icons.checkroom,
                    size: 20, color: const Color(0xFF6BB58C),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Flexible(child: Text(item.name, style: theme.textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700), overflow: TextOverflow.ellipsis)),
                          Text('₡${item.price}', style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w800)),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text('${item.brand} · ${item.color} · ${item.type}',
                        style: theme.textTheme.labelSmall?.copyWith(letterSpacing: 0.5, color: theme.colorScheme.onSurface.withValues(alpha: 0.5))),
                      const SizedBox(height: 3),
                      Text('"${item.why}"',
                        style: theme.textTheme.bodySmall?.copyWith(fontStyle: FontStyle.italic, color: theme.colorScheme.onSurface.withValues(alpha: 0.5))),
                    ],
                  ),
                ),
              ],
            ),
          )),
          Container(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Expanded(
                  child: GestureDetector(
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(color: theme.colorScheme.surfaceContainerHighest, borderRadius: BorderRadius.circular(16)),
                      child: const Center(child: Text('Ver similares', style: TextStyle(fontWeight: FontWeight.w700))),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: GestureDetector(
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(color: ink, borderRadius: BorderRadius.circular(16)),
                      child: const Center(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.shopping_bag, color: Colors.white, size: 16),
                            SizedBox(width: 6),
                            Text('Comprar look', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
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
}
