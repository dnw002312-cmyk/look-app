import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/product.dart';
import '../providers/auth_provider.dart';
import '../widgets/auth_gate.dart';

class UploadScreen extends StatefulWidget {
  final void Function(Product product)? onProductCreated;

  const UploadScreen({super.key, this.onProductCreated});

  @override
  State<UploadScreen> createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _priceController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _brandController = TextEditingController();

  ProductCategory _category = ProductCategory.mujer;
  String _size = 'M';
  String _color = 'Negro';
  String _condition = 'good';
  String _icon = 'shirt';

  bool _saving = false;

  final _sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Único'];
  final _colors = [
    'Negro', 'Blanco', 'Gris', 'Rojo', 'Azul',
    'Verde', 'Rosa', 'Amarillo', 'Beige', 'Marrón',
  ];
  final _conditions = [
    {'value': 'nuevo', 'label': 'Nuevo con etiqueta'},
    {'value': 'como nuevo', 'label': 'Como nuevo'},
    {'value': 'poco uso', 'label': 'Buen estado'},
    {'value': 'usado', 'label': 'Estado regular'},
  ];
  final _icons = ['skirt', 'shirt', 'checkroom', 'handbag', 'sunglasses', 'footsteps', 'hiking'];

  @override
  void dispose() {
    _nameController.dispose();
    _priceController.dispose();
    _descriptionController.dispose();
    _brandController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);

    final price = double.tryParse(_priceController.text) ?? 0;
    final now = DateTime.now();
    final newProduct = Product(
      id: now.millisecondsSinceEpoch,
      name: _nameController.text.trim(),
      category: _category,
      price: price,
      type: ProductType.sale,
      icon: _icon,
      sellerId: 1,
      size: _size,
      color: _color,
      brand: _brandController.text.trim(),
      condition: _condition,
      gender: _category == ProductCategory.mujer
          ? 'mujer'
          : _category == ProductCategory.hombre
              ? 'hombre'
              : 'unisex',
      style: '',
      location: '',
      description: _descriptionController.text.trim(),
      datePosted: '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}',
      likes: 0,
    );

    widget.onProductCreated?.call(newProduct);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Row(
            children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 12),
              Text('¡Producto publicado con éxito!'),
            ],
          ),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          backgroundColor: const Color(0xFF6BB58C),
        ),
      );
      Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) {
      return Scaffold(
        appBar: AppBar(
          title: Text('Publicar', style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800)),
        ),
        body: const AuthGate(
          title: 'Inicia sesión para publicar',
          subtitle: 'Crea una cuenta o inicia sesión para subir tus productos.',
        ),
      );
    }

    final theme = Theme.of(context);
    final cs = theme.colorScheme;
    const brand = Color(0xFF6BB58C);

    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Publicar producto',
          style: theme.textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w800),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            Text(
              'Icono del producto',
              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 10),
            SizedBox(
              height: 60,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _icons.length,
                separatorBuilder: (_, __) => const SizedBox(width: 10),
                itemBuilder: (context, index) {
                  final iconName = _icons[index];
                  final isSelected = _icon == iconName;
                  return GestureDetector(
                    onTap: () => setState(() => _icon = iconName),
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: isSelected ? brand.withValues(alpha: 0.15) : cs.surfaceContainerHighest,
                        borderRadius: BorderRadius.circular(16),
                        border: isSelected ? Border.all(color: brand, width: 2) : null,
                      ),
                      child: Center(
                        child: Icon(
                          productIcon(iconName),
                          size: 24,
                          color: isSelected ? brand : cs.onSurface,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),
            TextFormField(
              controller: _nameController,
              decoration: InputDecoration(
                labelText: 'Nombre del producto',
                prefixIcon: const Icon(Icons.label_outline),
                filled: true,
                fillColor: cs.surfaceContainerHighest,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Obligatorio' : null,
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _priceController,
              decoration: InputDecoration(
                labelText: 'Precio (\u20A1)',
                prefixIcon: const Icon(Icons.attach_money),
                filled: true,
                fillColor: cs.surfaceContainerHighest,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
              keyboardType: TextInputType.number,
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'Obligatorio';
                final price = double.tryParse(v);
                if (price == null || price <= 0) return 'Precio no válido';
                return null;
              },
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _descriptionController,
              decoration: InputDecoration(
                labelText: 'Descripción',
                prefixIcon: const Icon(Icons.description_outlined),
                filled: true,
                fillColor: cs.surfaceContainerHighest,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
                alignLabelWithHint: true,
              ),
              maxLines: 4,
            ),
            const SizedBox(height: 14),
            DropdownButtonFormField<ProductCategory>(
              value: _category,
              decoration: InputDecoration(
                labelText: 'Categoría',
                prefixIcon: const Icon(Icons.category_outlined),
                filled: true,
                fillColor: cs.surfaceContainerHighest,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
              items: const [
                DropdownMenuItem(value: ProductCategory.mujer, child: Text('Mujer')),
                DropdownMenuItem(value: ProductCategory.hombre, child: Text('Hombre')),
                DropdownMenuItem(value: ProductCategory.accesorios, child: Text('Accesorios')),
              ],
              onChanged: (v) {
                if (v != null) setState(() => _category = v);
              },
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _size,
                    decoration: InputDecoration(
                      labelText: 'Talla',
                      filled: true,
                      fillColor: cs.surfaceContainerHighest,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    items: _sizes.map((s) => DropdownMenuItem(value: s, child: Text(s))).toList(),
                    onChanged: (v) {
                      if (v != null) setState(() => _size = v);
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _color,
                    decoration: InputDecoration(
                      labelText: 'Color',
                      filled: true,
                      fillColor: cs.surfaceContainerHighest,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(14),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    items: _colors.map((c) => DropdownMenuItem(value: c, child: Text(c))).toList(),
                    onChanged: (v) {
                      if (v != null) setState(() => _color = v);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            TextFormField(
              controller: _brandController,
              decoration: InputDecoration(
                labelText: 'Marca',
                prefixIcon: const Icon(Icons.business_outlined),
                filled: true,
                fillColor: cs.surfaceContainerHighest,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Estado del producto',
              style: theme.textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 10),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: _conditions.map((c) {
                final isSelected = _condition == c['value'];
                return GestureDetector(
                  onTap: () => setState(() => _condition = c['value'] as String),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    decoration: BoxDecoration(
                      color: isSelected ? brand.withValues(alpha: 0.15) : cs.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(20),
                      border: isSelected ? Border.all(color: brand, width: 1.5) : null,
                    ),
                    child: Text(
                      c['label'] as String,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        color: isSelected ? brand : cs.onSurface,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 28),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: FilledButton.icon(
                onPressed: _saving ? null : _submit,
                icon: _saving
                    ? const SizedBox(
                        width: 18,
                        height: 18,
                        child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                      )
                    : const Icon(Icons.cloud_upload_outlined),
                label: Text(
                  _saving ? 'Publicando...' : 'Publicar producto',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                ),
                style: FilledButton.styleFrom(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
