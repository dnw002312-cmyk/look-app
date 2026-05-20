class Message {
  final String text;
  final bool isMine;
  final DateTime timestamp;

  const Message({
    required this.text,
    required this.isMine,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'text': text,
    'isMine': isMine,
    'timestamp': timestamp.toIso8601String(),
  };

  factory Message.fromJson(Map<String, dynamic> json) => Message(
    text: json['text'] as String,
    isMine: json['isMine'] as bool,
    timestamp: DateTime.parse(json['timestamp'] as String),
  );
}

class Conversation {
  final int partnerId;
  final String partnerName;
  final String partnerAvatar;
  final List<Message> messages;

  const Conversation({
    required this.partnerId,
    required this.partnerName,
    this.partnerAvatar = '',
    required this.messages,
  });

  String get lastMessageText =>
      messages.isNotEmpty ? messages.last.text : '';

  Map<String, dynamic> toJson() => {
    'partnerId': partnerId,
    'partnerName': partnerName,
    'partnerAvatar': partnerAvatar,
    'messages': messages.map((m) => m.toJson()).toList(),
  };

  factory Conversation.fromJson(Map<String, dynamic> json) => Conversation(
    partnerId: json['partnerId'] as int,
    partnerName: json['partnerName'] as String,
    partnerAvatar: json['partnerAvatar'] as String? ?? '',
    messages: (json['messages'] as List)
        .map((e) => Message.fromJson(e as Map<String, dynamic>))
        .toList(),
  );
}
