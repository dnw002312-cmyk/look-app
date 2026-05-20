import 'package:flutter/material.dart';
import '../data/users_data.dart';
import '../models/user.dart';

enum ProductType { sale }

enum ProductCategory { mujer, hombre, accesorios }

class Product {
  final int id;
  final String name;
  final ProductCategory category;
  final double price;
  final ProductType type;
  final String icon;
  final int sellerId;
  final String size;
  final String color;
  final String brand;
  final String condition;
  final String gender;
  final String style;
  final String location;
  final String? description;
  final String datePosted;
  final int likes;

  const Product({
    required this.id,
    required this.name,
    required this.category,
    required this.price,
    required this.type,
    required this.icon,
    this.sellerId = 1,
    this.size = '',
    this.color = '',
    this.brand = '',
    this.condition = 'good',
    this.gender = '',
    this.style = '',
    this.location = '',
    this.description,
    this.datePosted = '',
    this.likes = 0,
  });

  String get categoryLabel {
    switch (category) {
      case ProductCategory.mujer:
        return 'Mujer';
      case ProductCategory.hombre:
        return 'Hombre';
      case ProductCategory.accesorios:
        return 'Accesorios';
    }
  }

  String get typeLabel => 'Venta';

  String get conditionLabel {
    switch (condition) {
      case 'new':
      case 'nuevo':
        return 'Nuevo';
      case 'like_new':
      case 'como nuevo':
        return 'Como nuevo';
      case 'good':
      case 'poco uso':
        return 'Poco uso';
      case 'fair':
      case 'usado':
        return 'Usado';
      default:
        return condition;
    }
  }

  String get sellerName {
    final user = allUsers.cast<AppUser?>().firstWhere(
          (u) => u!.id == sellerId,
          orElse: () => null,
        );
    return user?.name ?? 'Vendedor';
  }

  String get sellerPhoto {
    final user = allUsers.cast<AppUser?>().firstWhere(
          (u) => u!.id == sellerId,
          orElse: () => null,
        );
    return user?.photo ?? 'person';
  }

  String? get sellerSince {
    final user = allUsers.cast<AppUser?>().firstWhere(
          (u) => u!.id == sellerId,
          orElse: () => null,
        );
    final date = user?.joinDate ?? '';
    return date.isEmpty ? null : date;
  }
}

class CartItem {
  final int id;
  final String name;
  final String icon;
  final double effectivePrice;

  const CartItem({
    required this.id,
    required this.name,
    required this.icon,
    required this.effectivePrice,
  });

  Map<String, dynamic> toJson() => {
        'id': id,
        'name': name,
        'icon': icon,
        'effectivePrice': effectivePrice,
      };

  factory CartItem.fromJson(Map<String, dynamic> json) => CartItem(
        id: json['id'] as int,
        name: json['name'] as String,
        icon: json['icon'] as String,
        effectivePrice: (json['effectivePrice'] as num).toDouble(),
      );
}

IconData productIcon(String name) {
  switch (name) {
    case 'skirt':
      return Icons.style;
    case 'checkroom':
      return Icons.checkroom;
    case 'handbag':
      return Icons.shopping_bag;
    case 'shirt':
      return Icons.checkroom;
    case 'sunglasses':
      return Icons.wb_sunny;
    case 'footsteps':
      return Icons.directions_walk;
    case 'hiking':
      return Icons.backpack;
    default:
      return Icons.checkroom;
  }
}
