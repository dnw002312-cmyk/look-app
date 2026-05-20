import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/api_service.dart';

class CartProvider extends ChangeNotifier {
  List<CartItem> _items = [];
  bool _isLoading = false;

  List<CartItem> get items => List.unmodifiable(_items);
  int get itemCount => _items.length;
  double get total => _items.fold(0.0, (sum, item) => sum + item.effectivePrice);
  bool get isEmpty => _items.isEmpty;
  bool get isLoading => _isLoading;

  bool isInCart(int productId) => _items.any((item) => item.id == productId);

  Future<void> load() async {
    _isLoading = true;
    notifyListeners();
    try {
      final raw = await ApiService.getCart();
      _items = raw
          .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      _items = [];
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> addToCart(int productId) async {
    try {
      final raw = await ApiService.addToCart(productId);
      _items = raw
          .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList();
      notifyListeners();
    } catch (_) {}
  }

  Future<void> removeItem(int index) async {
    if (index < 0 || index >= _items.length) return;
    try {
      final raw = await ApiService.removeFromCart(_items[index].id);
      _items = raw
          .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
          .toList();
      notifyListeners();
    } catch (_) {}
  }

  Future<void> checkout() async {
    try {
      await ApiService.checkout();
      _items.clear();
      notifyListeners();
    } catch (_) {}
  }

  // Keep backward compatibility with screens using toggleItem(Product)
  void toggleItem(Product product) {
    if (_items.any((item) => item.id == product.id)) {
      removeFromCartSync(product.id);
    } else {
      addToCart(product.id);
    }
  }

  void removeFromCartSync(int productId) {
    _items.removeWhere((item) => item.id == productId);
    notifyListeners();
  }
}
