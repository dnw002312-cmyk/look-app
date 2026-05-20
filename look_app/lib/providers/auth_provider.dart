import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  AppUser? _currentUser;
  String? _token;
  bool _isLoading = false;
  String? _error;

  AppUser? get currentUser => _currentUser;
  bool get isLoggedIn => _currentUser != null && _currentUser!.id != 0;
  bool get isAuthenticated => isLoggedIn;
  bool get isLoading => _isLoading;
  String? get error => _error;

  AppUser get guest => const AppUser(id: 0, name: 'Invitado', email: '');

  Future<void> loadFromPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('look_token');
    if (_token != null) {
      ApiService.setToken(_token);
      final userJson = prefs.getString('look_user');
      if (userJson != null) {
        final data = jsonDecode(userJson) as Map<String, dynamic>;
        _currentUser = AppUser.fromJson(data);
      } else {
        _currentUser = guest;
      }
    } else {
      _currentUser = guest;
    }
    notifyListeners();
  }

  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final data = await ApiService.login(email, password);
      _token = data['token'] as String;
      ApiService.setToken(_token);
      _currentUser = AppUser.fromJson(data['user'] as Map<String, dynamic>);
      await _saveTokenAndUser();
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _isLoading = false;
      _error = e.toString();
      notifyListeners();
      return false;
    }
  }

  Future<AppUser> register(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    try {
      final data = await ApiService.register(name, email, password);
      _token = data['token'] as String;
      ApiService.setToken(_token);
      _currentUser = AppUser.fromJson(data['user'] as Map<String, dynamic>);
      await _saveTokenAndUser();
      _isLoading = false;
      notifyListeners();
      return _currentUser!;
    } catch (e) {
      _isLoading = false;
      _error = e.toString();
      notifyListeners();
      rethrow;
    }
  }

  void logout() {
    _token = null;
    _currentUser = guest;
    ApiService.setToken(null);
    _clearTokenAndUser();
    notifyListeners();
  }

  Future<void> _saveTokenAndUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('look_token', _token!);
    await prefs.setString('look_user', jsonEncode(_currentUser!.toJson()));
  }

  Future<void> _clearTokenAndUser() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('look_token');
    await prefs.remove('look_user');
  }
}
