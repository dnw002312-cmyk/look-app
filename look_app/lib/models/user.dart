import 'package:flutter/material.dart';

IconData userIcon(String name) {
  switch (name) {
    case 'woman':
      return Icons.woman_outlined;
    case 'man':
      return Icons.man_outlined;
    case 'person':
      return Icons.person_outlined;
    default:
      return Icons.person_outlined;
  }
}

class AppUser {
  final int id;
  final String name;
  final String email;
  final String photo;
  final String description;
  final double rating;
  final int salesCount;
  final int followers;
  final int following;
  final String avgResponseTime;
  final String joinDate;

  const AppUser({
    required this.id,
    required this.name,
    required this.email,
    this.photo = '',
    this.description = '',
    this.rating = 0.0,
    this.salesCount = 0,
    this.followers = 0,
    this.following = 0,
    this.avgResponseTime = '',
    this.joinDate = '',
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'email': email,
        'photo': photo,
        'description': description,
        'rating': rating,
        'salesCount': salesCount,
        'followers': followers,
        'following': following,
        'avgResponseTime': avgResponseTime,
        'joinDate': joinDate,
      };

  factory AppUser.fromJson(Map<String, dynamic> json) => AppUser(
        id: json['id'] as int,
        name: json['name'] as String,
        email: json['email'] as String,
        photo: json['photo'] as String? ?? '',
        description: json['description'] as String? ?? '',
        rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
        salesCount: json['salesCount'] as int? ?? 0,
        followers: json['followers'] as int? ?? 0,
        following: json['following'] as int? ?? 0,
        avgResponseTime: json['avgResponseTime'] as String? ?? '',
        joinDate: json['joinDate'] as String? ?? '',
      );
}
