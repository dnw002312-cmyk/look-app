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
    'Negro',
    'Blanco',
    'Gris',
    'Rojo',
    'Azul',
    'Verde',
    'Rosa',
    'Amarillo',
    'Beige',
    'Marrón',
  ];
  final _conditions = [
    {'value': 'nuevo', 'label': 'Nuevo con etiqueta'},
    {'value': 'como nuevo', 'label': 'Como nuevo'},
    {'value': 'poco uso', 'label': 'Buen estado'},
    {'value': 'usado', 'label': 'Estado regular'},
  ];

  final _icons = [
    'skirt', 'shirt', 'checkroom', 'handbag',
    'sunglasses', 'footsteps', 'hiking',
  ];

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
      datePosted:
          '${now.year}-${now.month.toString().padLeft(2, '0')}-${now.day.toString().padLeft(2, '0')}',
      likes: 0,
    );

    widget.onProductCreated?.call(newProduct);

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Row(
            children: [
              Icon(Icons.check_circle, color: Colors.white),
              SizedBox(width: 12),
              Text('¡Producto publicado con éxito!'),
            ],
          ),
          behavior: SnackBarBehavior.floating,
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
        appBar: AppBar(title: const Text('Publicar producto')),
        body: const AuthGate(
          title: 'Inicia sesión para publicar',
          subtitle: 'Crea una cuenta o inicia sesión para subir tus productos y empezar a vender.',
        ),
      );
    }

    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Publicar producto'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              'Selecciona un icono para tu producto',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            SizedBox(
              height: 56,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _icons.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final iconName = _icons[index];
                  final isSelected = _icon == iconName;
                  return GestureDetector(
                    onTap: () => setState(() => _icon = iconName),
                    child: Container(
                      width: 52,
                      height: 52,
                      decoration: BoxDecoration(
                        color: isSelected
                            ? colorScheme.primaryContainer
                            : colorScheme.surfaceContainerHighest,
                        borderRadius: BorderRadius.circular(12),
                        border: isSelected
                            ? Border.all(color: colorScheme.primary, width: 2)
                            : null,
                      ),
                      child: Center(
                        child: Icon(
                          productIcon(iconName),
                          size: 24,
                          color: isSelected
                              ? colorScheme.primary
                              : colorScheme.onSurface,
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 20),
            TextFormField(
              controller: _nameController,
              decoration: const InputDecoration(
                labelText: 'Nombre del producto',
                prefixIcon: Icon(Icons.label_outline),
              ),
              validator: (v) =>
                  (v == null || v.trim().isEmpty) ? 'El nombre es obligatorio' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _priceController,
              decoration: const InputDecoration(
                labelText: 'Precio (\u20A1)',
                prefixIcon: Icon(Icons.attach_money),
              ),
              keyboardType: TextInputType.number,
              validator: (v) {
                if (v == null || v.trim().isEmpty) return 'El precio es obligatorio';
                final price = double.tryParse(v);
                if (price == null || price <= 0) return 'Precio no válido';
                return null;
              },
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Descripción',
                prefixIcon: Icon(Icons.description_outlined),
                alignLabelWithHint: true,
              ),
              maxLines: 4,
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<ProductCategory>(
              value: _category,
              decoration: const InputDecoration(
                labelText: 'Categoría',
                prefixIcon: Icon(Icons.category_outlined),
              ),
              items: const [
                DropdownMenuItem(
                  value: ProductCategory.mujer,
                  child: Text('Mujer'),
                ),
                DropdownMenuItem(
                  value: ProductCategory.hombre,
                  child: Text('Hombre'),
                ),
                DropdownMenuItem(
                  value: ProductCategory.accesorios,
                  child: Text('Accesorios'),
                ),
              ],
              onChanged: (v) {
                if (v != null) setState(() => _category = v);
              },
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _size,
                    decoration: const InputDecoration(
                      labelText: 'Talla',
                    ),
                    items: _sizes.map((s) {
                      return DropdownMenuItem(value: s, child: Text(s));
                    }).toList(),
                    onChanged: (v) {
                      if (v != null) setState(() => _size = v);
                    },
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: DropdownButtonFormField<String>(
                    value: _color,
                    decoration: const InputDecoration(
                      labelText: 'Color',
                    ),
                    items: _colors.map((c) {
                      return DropdownMenuItem(value: c, child: Text(c));
                    }).toList(),
                    onChanged: (v) {
                      if (v != null) setState(() => _color = v);
                    },
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _brandController,
              decoration: const InputDecoration(
                labelText: 'Marca',
                prefixIcon: Icon(Icons.business_outlined),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Estado del producto',
              style: theme.textTheme.titleSmall?.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            ..._conditions.map((c) {
              return RadioListTile<String>(
                value: c['value'] as String,
                groupValue: _condition,
                title: Text(c['label'] as String),
                contentPadding: EdgeInsets.zero,
                dense: true,
                onChanged: (v) {
                  if (v != null) setState(() => _condition = v);
                },
              );
            }),
            const SizedBox(height: 24),
            FilledButton.icon(
              onPressed: _saving ? null : _submit,
              icon: _saving
                  ? const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(
                        strokeWidth: 2,
                        color: Colors.white,
                      ),
                    )
                  : const Icon(Icons.cloud_upload_outlined),
              label: Text(_saving ? 'Publicando...' : 'Publicar producto'),
              style: FilledButton.styleFrom(
                minimumSize: const Size(double.infinity, 52),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }
}
