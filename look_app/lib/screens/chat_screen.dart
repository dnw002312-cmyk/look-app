import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/message.dart';
import '../models/user.dart';
import '../providers/auth_provider.dart';
import '../providers/chat_provider.dart';
import '../widgets/auth_gate.dart';

class ChatScreen extends StatefulWidget {
  final int? initialPartnerId;
  final String? initialProductTitle;

  const ChatScreen({super.key, this.initialPartnerId, this.initialProductTitle});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  int? _selectedPartnerId;

  @override
  void initState() {
    super.initState();
    if (widget.initialPartnerId != null) {
      _selectedPartnerId = widget.initialPartnerId;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final chat = context.read<ChatProvider>();
        chat.setActive(
          widget.initialPartnerId!,
          productTitle: widget.initialProductTitle,
        );
      });
    }
  }

  @override
  void dispose() {
    final chat = context.read<ChatProvider>();
    chat.clearActive();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) {
      return Scaffold(
        appBar: AppBar(title: const Text('Mensajes')),
        body: const AuthGate(
          title: 'Inicia sesión para chatear',
          subtitle: 'Crea una cuenta o inicia sesión para enviar y recibir mensajes.',
        ),
      );
    }

    final chat = context.watch<ChatProvider>();
    final isWide = MediaQuery.of(context).size.width > 600;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mensajes'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: _selectedPartnerId != null && !isWide
              ? () => setState(() => _selectedPartnerId = null)
              : () => Navigator.of(context).pop(),
        ),
      ),
      body: isWide ? _buildWide(chat) : _buildMobile(chat),
    );
  }

  Widget _buildWide(ChatProvider chat) {
    return Row(
      children: [
        SizedBox(
          width: 320,
          child: _ConversationList(
            conversations: chat.conversations,
            selectedId: _selectedPartnerId,
            onSelect: (id) {
              setState(() => _selectedPartnerId = id);
              chat.setActive(id, productTitle: widget.initialProductTitle);
            },
          ),
        ),
        VerticalDivider(width: 1, color: Theme.of(context).colorScheme.outlineVariant),
        Expanded(
          child: _selectedPartnerId != null
              ? _ConversationView(
                  conversation: chat.getConversation(_selectedPartnerId!) ??
                      Conversation(
                        partnerId: _selectedPartnerId!,
                        partnerName: '',
                        messages: const [],
                      ),
                  isTyping: chat.isTyping,
                  onSend: (text) => chat.sendMessage(_selectedPartnerId!, text),
                )
              : Center(
                  child: Text(
                    'Selecciona una conversación',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          color: Theme.of(context)
                              .colorScheme
                              .onSurface
                              .withValues(alpha: 0.5),
                        ),
                  ),
                ),
        ),
      ],
    );
  }

  Widget _buildMobile(ChatProvider chat) {
    if (_selectedPartnerId == null) {
      return _ConversationList(
        conversations: chat.conversations,
        selectedId: null,
        onSelect: (id) {
          setState(() => _selectedPartnerId = id);
          chat.setActive(id, productTitle: widget.initialProductTitle);
        },
      );
    }

    final conv = chat.getConversation(_selectedPartnerId!) ??
        Conversation(
          partnerId: _selectedPartnerId!,
          partnerName: '',
          messages: const [],
        );

    return _ConversationView(
      conversation: conv,
      isTyping: chat.isTyping,
      onSend: (text) => chat.sendMessage(_selectedPartnerId!, text),
    );
  }
}

class _ConversationList extends StatelessWidget {
  final List<Conversation> conversations;
  final int? selectedId;
  final ValueChanged<int> onSelect;

  const _ConversationList({
    required this.conversations,
    required this.selectedId,
    required this.onSelect,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (conversations.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.chat_bubble_outline,
                size: 48,
                color: theme.colorScheme.onSurface.withValues(alpha: 0.3),
              ),
              const SizedBox(height: 12),
              Text(
                'No hay conversaciones',
                style: theme.textTheme.bodyLarge?.copyWith(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Tocá "Contactar" en un producto para empezar',
                textAlign: TextAlign.center,
                style: theme.textTheme.bodySmall?.copyWith(
                  color: theme.colorScheme.onSurface.withValues(alpha: 0.5),
                ),
              ),
            ],
          ),
        ),
      );
    }

    return ListView.separated(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: conversations.length,
      separatorBuilder: (_, __) => const Divider(height: 1, indent: 72),
      itemBuilder: (context, index) {
        final conv = conversations[index];
        final isSelected = conv.partnerId == selectedId;
        return ListTile(
          selected: isSelected,
          selectedTileColor: theme.colorScheme.primaryContainer.withValues(alpha: 0.3),
          leading: CircleAvatar(
            backgroundColor: theme.colorScheme.surfaceContainerHighest,
            child: Icon(
              conv.partnerAvatar.isNotEmpty
                  ? userIcon(conv.partnerAvatar)
                  : Icons.person_outlined,
              size: 20,
            ),
          ),
          title: Text(
            conv.partnerName,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
          subtitle: Text(
            conv.lastMessageText,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
            ),
          ),
          onTap: () => onSelect(conv.partnerId),
        );
      },
    );
  }
}

class _ConversationView extends StatefulWidget {
  final Conversation conversation;
  final bool isTyping;
  final ValueChanged<String> onSend;

  const _ConversationView({
    required this.conversation,
    required this.isTyping,
    required this.onSend,
  });

  @override
  State<_ConversationView> createState() => _ConversationViewState();
}

class _ConversationViewState extends State<_ConversationView> {
  final _controller = TextEditingController();
  final _scrollController = ScrollController();

  @override
  void dispose() {
    _controller.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _send() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;
    widget.onSend(text);
    _controller.clear();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _scrollToBottom();
    });
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 200),
        curve: Curves.easeOut,
      );
    }
  }

  String _formatTime(DateTime t) {
    final h = t.hour.toString().padLeft(2, '0');
    final m = t.minute.toString().padLeft(2, '0');
    return '$h:$m';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colorScheme = theme.colorScheme;

    WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());

    return Column(
      children: [
        if (widget.conversation.partnerName.isNotEmpty)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: colorScheme.surface,
              border: Border(bottom: BorderSide(color: colorScheme.outlineVariant)),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 18,
                  backgroundColor: colorScheme.surfaceContainerHighest,
                  child: Icon(
                    widget.conversation.partnerAvatar.isNotEmpty
                        ? userIcon(widget.conversation.partnerAvatar)
                        : Icons.person_outlined,
                    size: 18,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.conversation.partnerName,
                        style: theme.textTheme.titleSmall?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.auto_awesome, size: 11, color: colorScheme.secondary),
                          const SizedBox(width: 4),
                          Text(
                            'Respuestas con IA',
                            style: theme.textTheme.labelSmall?.copyWith(
                              color: colorScheme.secondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        Expanded(
          child: ListView.builder(
            controller: _scrollController,
            padding: const EdgeInsets.all(16),
            itemCount: widget.conversation.messages.length,
            itemBuilder: (context, index) {
              final msg = widget.conversation.messages[index];
              final isMine = msg.isMine;
              return Align(
                alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.fromLTRB(16, 10, 16, 6),
                  constraints: BoxConstraints(
                    maxWidth: MediaQuery.of(context).size.width * 0.7,
                  ),
                  decoration: BoxDecoration(
                    color: isMine
                        ? colorScheme.primary
                        : colorScheme.surfaceContainerHighest,
                    borderRadius: BorderRadius.only(
                      topLeft: const Radius.circular(18),
                      topRight: const Radius.circular(18),
                      bottomLeft: isMine
                          ? const Radius.circular(18)
                          : const Radius.circular(4),
                      bottomRight: isMine
                          ? const Radius.circular(4)
                          : const Radius.circular(18),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        msg.text,
                        style: TextStyle(
                          color: isMine ? Colors.white : colorScheme.onSurface,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        _formatTime(msg.timestamp),
                        style: TextStyle(
                          fontSize: 9,
                          color: isMine
                              ? Colors.white.withValues(alpha: 0.5)
                              : colorScheme.onSurface.withValues(alpha: 0.5),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        if (widget.isTyping)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
            child: Align(
              alignment: Alignment.centerLeft,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: colorScheme.surfaceContainerHighest,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    _BouncingDot(delay: 0),
                    const SizedBox(width: 4),
                    _BouncingDot(delay: 150),
                    const SizedBox(width: 4),
                    _BouncingDot(delay: 300),
                  ],
                ),
              ),
            ),
          ),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: colorScheme.surface,
            border: Border(
              top: BorderSide(color: colorScheme.outlineVariant),
            ),
          ),
          child: SafeArea(
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Escribe un mensaje...',
                      filled: true,
                      fillColor: colorScheme.surfaceContainerHighest
                          .withValues(alpha: 0.5),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(24),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 20,
                        vertical: 12,
                      ),
                    ),
                    textInputAction: TextInputAction.send,
                    onSubmitted: (_) => _send(),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton.filled(
                  onPressed: _send,
                  icon: const Icon(Icons.send_rounded),
                  style: IconButton.styleFrom(
                    shape: const CircleBorder(),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class _BouncingDot extends StatefulWidget {
  final int delay;
  const _BouncingDot({required this.delay});

  @override
  State<_BouncingDot> createState() => _BouncingDotState();
}

class _BouncingDotState extends State<_BouncingDot> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    )..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (context, _) {
        final t = (_ctrl.value + widget.delay / 600) % 1.0;
        final offset = (t < 0.5 ? t * 2 : 2 - t * 2) - 0.5;
        return Transform.translate(
          offset: Offset(0, offset * -4),
          child: Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.onSurface.withValues(alpha: 0.4),
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }
}
