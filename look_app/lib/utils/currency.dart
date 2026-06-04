String fmtCRC(num value) {
  final negative = value < 0;
  final s = value.abs().round().toString();
  final b = <String>[];
  for (int i = s.length; i > 0; i -= 3) {
    b.insert(0, s.substring(i > 3 ? i - 3 : 0, i));
  }
  return '${negative ? '-' : ''}\u20A1${b.join('.')}';
}
