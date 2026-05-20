import 'package:flutter/foundation.dart';
import '../data/products_data.dart';
import '../models/product.dart';
import '../services/api_service.dart';

class FavoritesProvider extends ChangeNotifier {
  Set<int> _favoriteIds = {};
  bool _isLoading = false;

  Set<int> get favoriteIds => Set.unmodifiable(_favoriteIds);
  int get count => _favoriteIds.length;
  bool get isLoading => _isLoading;

  List<Product> get favorites {
    return allProducts.where((p) => _favoriteIds.contains(p.id)).toList();
  }

  bool isFavorite(int productId) => _favoriteIds.contains(productId);

  Future<void> load() async {
    _isLoading = true;
    notifyListeners();
    try {
      _favoriteIds = await ApiService.getFavorites();
    } catch (_) {
      _favoriteIds = {};
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> toggle(int productId) async {
    try {
      _favoriteIds = await ApiService.toggleFavorite(productId);
      notifyListeners();
    } catch (_) {}
  }
}
