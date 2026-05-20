import 'package:flutter/foundation.dart';
import '../services/api_service.dart';

class FollowProvider extends ChangeNotifier {
  Set<int> _followedIds = {};
  bool _isLoading = false;

  Set<int> get followedIds => Set.unmodifiable(_followedIds);
  bool get isLoading => _isLoading;

  bool isFollowing(int sellerId) => _followedIds.contains(sellerId);

  Future<void> load() async {
    _isLoading = true;
    notifyListeners();
    try {
      _followedIds = await ApiService.getFollows();
    } catch (_) {
      _followedIds = {};
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> toggle(int sellerId) async {
    try {
      _followedIds = await ApiService.toggleFollow(sellerId);
      notifyListeners();
    } catch (_) {}
  }
}
