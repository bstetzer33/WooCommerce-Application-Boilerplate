import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRoute, RouteProp } from '@react-navigation/native';
import apiClient from '@services/api';
import { useProduct, useReviews } from '@hooks/useProducts';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { COLORS, SPACING } from '@constants/index';
import { formatPrice } from '@utils/helpers';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { ErrorDisplay } from '@components/ErrorDisplay';
import { Review, ProductAttribute } from '@types/index';

type ProductDetailsRouteProp = RouteProp<{ params: { productId: number } }, 'params'>;

export const ProductDetailsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const route = useRoute<ProductDetailsRouteProp>();
  const { productId } = route.params;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  const { product, loading, error } = useProduct(productId);
  const { reviews, loading: reviewsLoading } = useReviews(productId);

  const addItem = useCartStore((state) => state.addItem);
  const isFavorite = useWishlistStore((state) => state.isFavorite);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error || !product) {
    return <ErrorDisplay message={error || 'Product not found'} fullScreen />;
  }

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${JSON.stringify(selectedVariants)}`,
      product_id: product.id,
      quantity,
      attributes: selectedVariants,
    });
  };

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Gallery */}
      {product.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.images[0].src }}
            style={styles.image}
            accessibilityLabel={product.name}
          />
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleToggleFavorite}
            accessible
            accessibilityLabel={isFavorite(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <MaterialCommunityIcons
              name={isFavorite(product.id) ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite(product.id) ? COLORS.ERROR : COLORS.TEXT_SECONDARY}
            />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {/* Product Info */}
        <Text style={styles.title}>{product.name}</Text>

        <View style={styles.ratingContainer}>
          <MaterialCommunityIcons name="star" size={16} color="#FFB800" />
          <Text style={styles.rating}>{product.rating || 0}</Text>
          <Text style={styles.reviewCount}>({product.review_count} reviews)</Text>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${formatPrice(product.sale_price || product.price)}</Text>
          {product.sale_price && (
            <Text style={styles.originalPrice}>${formatPrice(product.regular_price)}</Text>
          )}
        </View>

        {/* Availability */}
        <View style={styles.availabilityContainer}>
          <MaterialCommunityIcons
            name={product.in_stock ? 'check-circle' : 'alert-circle'}
            size={16}
            color={product.in_stock ? COLORS.SUCCESS : COLORS.ERROR}
          />
          <Text style={[styles.availability, { color: product.in_stock ? COLORS.SUCCESS : COLORS.ERROR }]}>
            {product.in_stock ? 'In Stock' : 'Out of Stock'}
          </Text>
        </View>

        {/* Variants */}
        {product.attributes && product.attributes.length > 0 && (
          <View style={styles.variantsContainer}>
            <Text style={styles.variantsTitle}>Select Options:</Text>
            {product.attributes.map((attr) => (
              <View key={attr.id} style={styles.attributeContainer}>
                <Text style={styles.attributeName}>{attr.name}:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {attr.options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.optionButton,
                        selectedVariants[attr.name] === option && styles.optionButtonActive,
                      ]}
                      onPress={() => setSelectedVariants({ ...selectedVariants, [attr.name]: option })}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedVariants[attr.name] === option && styles.optionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ))}
          </View>
        )}

        {/* Quantity */}
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <View style={styles.quantityControl}>
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity === 1}
            >
              <MaterialCommunityIcons
                name="minus"
                size={20}
                color={quantity === 1 ? COLORS.GRAY_MEDIUM : COLORS.PRIMARY}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={quantity.toString()}
              onChangeText={(val) => {
                const num = parseInt(val) || 1;
                setQuantity(Math.max(1, Math.min(num, product.stock_quantity || 999)));
              }}
              keyboardType="number-pad"
              accessible
              accessibilityLabel="Quantity input"
            />
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              disabled={quantity >= (product.stock_quantity || 999)}
            >
              <MaterialCommunityIcons
                name="plus"
                size={20}
                color={quantity >= (product.stock_quantity || 999) ? COLORS.GRAY_MEDIUM : COLORS.PRIMARY}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[styles.addToCartButton, !product.in_stock && styles.buttonDisabled]}
          onPress={handleAddToCart}
          disabled={!product.in_stock}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.activeTab]}
            onPress={() => setActiveTab('details')}
          >
            <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'details' ? (
          <View>
            {product.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Description</Text>
                <Text style={styles.description}>{product.description}</Text>
              </View>
            )}
            {product.short_description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>Overview</Text>
                <Text style={styles.description}>{product.short_description}</Text>
              </View>
            )}
          </View>
        ) : (
          <View>
            {reviewsLoading ? (
              <ActivityIndicator color={COLORS.PRIMARY} style={styles.loadingReviews} />
            ) : reviews.length > 0 ? (
              <FlatList
                data={reviews}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                renderItem={({ item: review }) => (
                  <View style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewerName}>{review.reviewer}</Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <MaterialCommunityIcons
                            key={i}
                            name={i < review.rating ? 'star' : 'star-outline'}
                            size={14}
                            color="#FFB800"
                          />
                        ))}
                      </View>
                    </View>
                    <Text style={styles.reviewText}>{review.review}</Text>
                    <Text style={styles.reviewDate}>
                      {new Date(review.date_created).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noReviews}>No reviews yet</Text>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
    backgroundColor: COLORS.GRAY_LIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: SPACING.LG,
    right: SPACING.LG,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    padding: SPACING.LG,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.XS,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  originalPrice: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginLeft: SPACING.MD,
    textDecorationLine: 'line-through',
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  availability: {
    marginLeft: SPACING.SM,
    fontSize: 14,
    fontWeight: '600',
  },
  variantsContainer: {
    marginBottom: SPACING.LG,
  },
  variantsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
  },
  attributeContainer: {
    marginBottom: SPACING.MD,
  },
  attributeName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
  },
  optionButton: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 4,
    marginRight: SPACING.SM,
  },
  optionButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  optionText: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
  },
  optionTextActive: {
    color: COLORS.BACKGROUND_LIGHT,
    fontWeight: '600',
  },
  quantityContainer: {
    marginBottom: SPACING.LG,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 4,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    width: 120,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    marginHorizontal: SPACING.MD,
  },
  addToCartButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SPACING.LG,
  },
  buttonDisabled: {
    backgroundColor: COLORS.GRAY_MEDIUM,
    opacity: 0.6,
  },
  addToCartText: {
    color: COLORS.BACKGROUND_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    marginBottom: SPACING.LG,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.PRIMARY,
  },
  descriptionContainer: {
    marginBottom: SPACING.LG,
  },
  descriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  description: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
  },
  loadingReviews: {
    paddingVertical: SPACING.LG,
  },
  reviewItem: {
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.SM,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  noReviews: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    paddingVertical: SPACING.LG,
  },
});
