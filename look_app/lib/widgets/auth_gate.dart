import 'package:flutter/material.dart';
import '../screens/auth_screen.dart';

class AuthGate extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;

  const AuthGate({
    super.key,
    this.title = 'Inicia sesión para continuar',
    this.subtitle = 'Crea una cuenta o inicia sesión para acceder a todas las funciones.',
    this.icon = Icons.lock_outline,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 64, color: theme.colorScheme.primary),
            const SizedBox(height: 24),
            Text(
              title,
              style: theme.textTheme.titleLarge,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 12),
            Text(
              subtitle,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurface.withValues(alpha: 0.6),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            FilledButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const AuthScreen(initialIsLogin: true),
                ),
              ),
              child: const Text('Iniciar sesión'),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const AuthScreen(initialIsLogin: false),
                ),
              ),
              child: const Text('Crear cuenta'),
            ),
          ],
        ),
      ),
    );
  }
}
