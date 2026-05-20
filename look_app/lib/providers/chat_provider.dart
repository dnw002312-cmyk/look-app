import 'package:flutter/foundation.dart';
import '../models/message.dart';
import '../services/api_service.dart';

class ChatProvider extends ChangeNotifier {
  List<Conversation> _conversations = [];
  bool _isLoading = false;

  List<Conversation> get conversations => List.unmodifiable(_conversations);
  bool get isLoading => _isLoading;

  Conversation? getConversation(int partnerId) {
    try {
      return _conversations.firstWhere((c) => c.partnerId == partnerId);
    } catch (_) {
      return null;
    }
  }

  Future<void> load() async {
    _isLoading = true;
    notifyListeners();
    try {
      final raw = await ApiService.getConversations();
      _conversations = raw
          .map((e) => Conversation.fromJson(e as Map<String, dynamic>))
          .toList();
    } catch (_) {
      _conversations = [];
    }
    _isLoading = false;
    notifyListeners();
  }

  Future<void> getMessages(int partnerId) async {
    try {
      final raw = await ApiService.getMessages(partnerId);
      final messages = raw
          .map((e) => Message.fromJson(e as Map<String, dynamic>))
          .toList();
      final index = _conversations.indexWhere((c) => c.partnerId == partnerId);
      if (index >= 0) {
        _conversations[index] = Conversation(
          partnerId: _conversations[index].partnerId,
          partnerName: _conversations[index].partnerName,
          partnerAvatar: _conversations[index].partnerAvatar,
          messages: messages,
        );
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> sendMessage(int partnerId, String text) async {
    if (text.trim().isEmpty) return;
    try {
      final raw = await ApiService.sendMessage(partnerId, text);
      final messages = raw
          .map((e) => Message.fromJson(e as Map<String, dynamic>))
          .toList();
      final index = _conversations.indexWhere((c) => c.partnerId == partnerId);
      if (index >= 0) {
        _conversations[index] = Conversation(
          partnerId: _conversations[index].partnerId,
          partnerName: _conversations[index].partnerName,
          partnerAvatar: _conversations[index].partnerAvatar,
          messages: messages,
        );
        notifyListeners();
      }
    } catch (_) {}
  }

  void startConversation(int partnerId, String partnerName,
      {String partnerAvatar = ''}) {
    if (getConversation(partnerId) == null) {
      _conversations.insert(
        0,
        Conversation(
          partnerId: partnerId,
          partnerName: partnerName,
          partnerAvatar: partnerAvatar,
          messages: [],
        ),
      );
      notifyListeners();
    }
  }
}
