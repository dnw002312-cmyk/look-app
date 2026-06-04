import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/message.dart';
import '../models/user.dart';
import '../data/users_data.dart';
import '../services/api_service.dart';

class ChatProvider extends ChangeNotifier {
  static const _storageKey = 'look_chat_conversations_v2';

  List<Conversation> _conversations = [];
  bool _isLoading = false;
  bool _isTyping = false;
  String? _activePartnerId;
  String? _activeProductTitle;
  String? _error;

  List<Conversation> get conversations => List.unmodifiable(_conversations);
  bool get isLoading => _isLoading;
  bool get isTyping => _isTyping;
  String? get activePartnerId => _activePartnerId;
  String? get activeProductTitle => _activeProductTitle;
  String? get error => _error;

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
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_storageKey);
      if (raw != null && raw.isNotEmpty) {
        final list = (jsonDecode(raw) as List)
            .map((e) => Conversation.fromJson(e as Map<String, dynamic>))
            .toList();
        _conversations = list;
      } else {
        _conversations = _seedConversations();
        await _persist();
      }
    } catch (_) {
      _conversations = _seedConversations();
    }
    _isLoading = false;
    notifyListeners();
  }

  List<Conversation> _seedConversations() {
    return [
      Conversation(
        partnerId: 1,
        partnerName: 'María García',
        partnerAvatar: 'woman',
        messages: [
          Message(
            text: '¡Hola! 👋 Vi que te interesó el Vestido floral verano. ¿Sigue disponible?',
            isMine: false,
            timestamp: DateTime.now().subtract(const Duration(minutes: 12)),
          ),
        ],
      ),
      Conversation(
        partnerId: 2,
        partnerName: 'Carlos López',
        partnerAvatar: 'man',
        messages: [
          Message(
            text: 'Te mando foto del estado real 📸',
            isMine: false,
            timestamp: DateTime.now().subtract(const Duration(hours: 1)),
          ),
        ],
      ),
      Conversation(
        partnerId: 3,
        partnerName: 'Ana Martínez',
        partnerAvatar: 'woman',
        messages: [
          Message(
            text: 'Perfecto, envío mañana 📦',
            isMine: false,
            timestamp: DateTime.now().subtract(const Duration(days: 1)),
          ),
        ],
      ),
    ];
  }

  Future<void> _persist() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final encoded = jsonEncode(_conversations.map((c) => c.toJson()).toList());
      await prefs.setString(_storageKey, encoded);
    } catch (_) {}
  }

  void startConversation(int partnerId, String partnerName, {String partnerAvatar = ''}) {
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
      _persist();
    }
  }

  void setActive(int partnerId, {String? productTitle}) {
    _activePartnerId = partnerId.toString();
    _activeProductTitle = productTitle;
    notifyListeners();
  }

  void clearActive() {
    _activePartnerId = null;
    _activeProductTitle = null;
    _error = null;
    notifyListeners();
  }

  AppUser? _findUser(int partnerId) {
    try {
      return allUsers.firstWhere((u) => u.id == partnerId);
    } catch (_) {
      return null;
    }
  }

  Future<void> sendMessage(int partnerId, String text) async {
    final trimmed = text.trim();
    if (trimmed.isEmpty) return;

    final user = _findUser(partnerId);
    if (user == null) {
      _error = 'Vendedor no encontrado';
      notifyListeners();
      return;
    }

    final conv = getConversation(partnerId);
    if (conv == null) {
      startConversation(partnerId, user.name, partnerAvatar: user.photo);
    }

    final now = DateTime.now();
    final userMsg = Message(text: trimmed, isMine: true, timestamp: now);
    _appendMessage(partnerId, userMsg);

    setActive(partnerId, productTitle: _activeProductTitle);
    _isTyping = true;
    _error = null;
    notifyListeners();

    try {
      final updatedConv = getConversation(partnerId)!;
      final history = updatedConv.messages
          .map((m) => {'from': m.isMine ? 'me' : 'them', 'text': m.text})
          .toList();
      final productTitle = _activeProductTitle ?? 'este producto';

      final replyText = await ApiService.getAiChatReply(
        sellerName: user.name,
        productTitle: productTitle,
        history: history,
      );

      final replyMsg = Message(text: replyText, isMine: false, timestamp: DateTime.now());
      _appendMessage(partnerId, replyMsg);
    } catch (e) {
      _error = 'No pude responder ahora mismo';
      _appendMessage(
        partnerId,
        Message(
          text: 'Disculpá, tuve un problema de conexión 🫠 ¿me escribís de nuevo?',
          isMine: false,
          timestamp: DateTime.now(),
        ),
      );
    } finally {
      _isTyping = false;
      notifyListeners();
    }
  }

  void _appendMessage(int partnerId, Message msg) {
    final index = _conversations.indexWhere((c) => c.partnerId == partnerId);
    if (index >= 0) {
      final existing = _conversations[index];
      final newMessages = [...existing.messages, msg];
      _conversations[index] = Conversation(
        partnerId: existing.partnerId,
        partnerName: existing.partnerName,
        partnerAvatar: existing.partnerAvatar,
        messages: newMessages,
      );
      _conversations.sort((a, b) {
        final aLast = a.messages.isNotEmpty ? a.messages.last.timestamp : DateTime.fromMillisecondsSinceEpoch(0);
        final bLast = b.messages.isNotEmpty ? b.messages.last.timestamp : DateTime.fromMillisecondsSinceEpoch(0);
        return bLast.compareTo(aLast);
      });
      notifyListeners();
      _persist();
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
