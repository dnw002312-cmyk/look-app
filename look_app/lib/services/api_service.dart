import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String _baseUrl = 'https://look-app-production.up.railway.app/api';
  static String get base => _baseUrl;
  static String? _token;

  static void setToken(String? token) {
    _token = token;
  }

  static Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    if (_token != null) 'Authorization': _token!,
  };

  static Future<T> _get<T>(String path, T Function(dynamic) fromJson) async {
    final res = await http.get(Uri.parse('$base$path'), headers: _headers);
    if (res.statusCode != 200) throw Exception(_errorMsg(res));
    return fromJson(jsonDecode(res.body));
  }

  static Future<T> _post<T>(
      String path, Map<String, dynamic> body, T Function(dynamic) fromJson) async {
    final res =
        await http.post(Uri.parse('$base$path'), headers: _headers, body: jsonEncode(body));
    if (res.statusCode >= 400) throw Exception(_errorMsg(res));
    return fromJson(jsonDecode(res.body));
  }

  static Future<T> _delete<T>(String path, T Function(dynamic) fromJson) async {
    final res = await http.delete(Uri.parse('$base$path'), headers: _headers);
    if (res.statusCode != 200) throw Exception(_errorMsg(res));
    return fromJson(jsonDecode(res.body));
  }

  static String _errorMsg(http.Response res) {
    try {
      return jsonDecode(res.body)['error'] ?? 'Error $res.statusCode';
    } catch (_) {
      return 'Error $res.statusCode';
    }
  }

  // Auth
  static Future<Map<String, dynamic>> login(String email, String password) {
    return _post<Map<String, dynamic>>(
      '/auth/login',
      {'email': email, 'password': password},
      (j) => j as Map<String, dynamic>,
    );
  }

  static Future<Map<String, dynamic>> register(String name, String email, String password) {
    return _post<Map<String, dynamic>>(
      '/auth/register',
      {'name': name, 'email': email, 'password': password},
      (j) => j as Map<String, dynamic>,
    );
  }

  // Products
  static Future<List<dynamic>> getProducts() {
    return _get<List<dynamic>>('/products', (j) => j as List<dynamic>);
  }

  static Future<Map<String, dynamic>> getProduct(int id) {
    return _get<Map<String, dynamic>>(
      '/products/$id',
      (j) => j as Map<String, dynamic>,
    );
  }

  static Future<Map<String, dynamic>> createProduct(Map<String, dynamic> data) {
    return _post<Map<String, dynamic>>('/products', data, (j) => j as Map<String, dynamic>);
  }

  // Cart
  static Future<List<dynamic>> getCart() {
    return _get<List<dynamic>>('/cart', (j) => j as List<dynamic>);
  }

  static Future<List<dynamic>> addToCart(int productId) {
    return _post<List<dynamic>>(
      '/cart',
      {'productId': productId},
      (j) => j as List<dynamic>,
    );
  }

  static Future<List<dynamic>> removeFromCart(int productId) {
    return _delete<List<dynamic>>('/cart/$productId', (j) => j as List<dynamic>);
  }

  static Future<void> checkout() async {
    await _post<Null>('/cart/checkout', {}, (_) => null);
  }

  // Favorites
  static Future<Set<int>> getFavorites() {
    return _get<Set<int>>('/favorites', (j) {
      final list = (j as Map<String, dynamic>)['favoriteIds'] as List;
      return list.map((e) => e as int).toSet();
    });
  }

  static Future<Set<int>> toggleFavorite(int productId) {
    return _post<Set<int>>(
      '/favorites/$productId/toggle',
      {},
      (j) {
        final list = (j as Map<String, dynamic>)['favoriteIds'] as List;
        return list.map((e) => e as int).toSet();
      },
    );
  }

  // Follows
  static Future<Set<int>> getFollows() {
    return _get<Set<int>>('/follows', (j) {
      final list = (j as Map<String, dynamic>)['followedIds'] as List;
      return list.map((e) => e as int).toSet();
    });
  }

  static Future<Set<int>> toggleFollow(int sellerId) {
    return _post<Set<int>>(
      '/follows/$sellerId/toggle',
      {},
      (j) {
        final list = (j as Map<String, dynamic>)['followedIds'] as List;
        return list.map((e) => e as int).toSet();
      },
    );
  }

  // Messages
  static Future<List<dynamic>> getConversations() {
    return _get<List<dynamic>>('/messages/conversations', (j) => j as List<dynamic>);
  }

  static Future<List<dynamic>> getMessages(int convId) {
    return _get<List<dynamic>>('/messages/$convId', (j) => j as List<dynamic>);
  }

  static Future<List<dynamic>> sendMessage(int convId, String text) {
    return _post<List<dynamic>>(
      '/messages/$convId',
      {'text': text},
      (j) => j as List<dynamic>,
    );
  }

  // User
  static Future<Map<String, dynamic>> getUser(int id) {
    return _get<Map<String, dynamic>>('/users/$id', (j) => j as Map<String, dynamic>);
  }
}
