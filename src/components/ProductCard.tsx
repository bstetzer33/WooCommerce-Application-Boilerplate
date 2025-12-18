import React from 'react';
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Product } from '@types/index';
import { COLORS, SPACING } from '@constants/index';
import { formatPrice, calculateDiscount } from '@utils/helpers';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onAddToCart?: () => void;
  onAddToWishlist?: () => void;
  isFavorite?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  onAddToWishlist,
  isFavorite = false,
}) => {
  const discount = calculateDiscount(
    parseFloat(product.regular_price),
    parseFloat(product.sale_price || product.price)
  );

  const displayPrice = product.sale_price || product.price;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {product.images[0] && (
          <Image
            source={{ uri: product.images[0].src }}
            style={styles.image}
            accessibilityLabel={product.name}
          />
        )}
        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onAddToWishlist}
          accessible
          accessibilityLabel={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? COLORS.ERROR : COLORS.TEXT_SECONDARY}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.name}
        </Text>

        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
          <Text style={styles.rating}>{product.rating || 0}</Text>
          <Text style={styles.reviewCount}>({product.review_count})</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${formatPrice(displayPrice)}</Text>
          {product.sale_price && (
            <Text style={styles.originalPrice}>${formatPrice(product.regular_price)}</Text>
          )}
        </View>

        {onAddToCart && (
          <TouchableOpacity style={styles.addToCartButton} onPress={onAddToCart}>
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: SPACING.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: COLORS.ERROR,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.XS,
    borderRadius: 4,
  },
  discountText: {
    color: COLORS.BACKGROUND_LIGHT,
    fontSize: 12,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.MD,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  rating: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.XS,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.XS,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  originalPrice: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.SM,
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.SM,
    borderRadius: 4,
    alignItems: 'center',
  },
  addToCartText: {
    color: COLORS.BACKGROUND_LIGHT,
    fontSize: 12,
    fontWeight: '600',
  },
});
