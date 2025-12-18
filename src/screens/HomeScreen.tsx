import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import apiClient from '@services/api';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { COLORS, SPACING, PAGINATION } from '@constants/index';
import { ProductCard } from '@components/ProductCard';
import { LoadingSpinner } from '@components/LoadingSpinner';
import { ErrorDisplay } from '@components/ErrorDisplay';
import { handleApiError } from '@utils/errorHandler';
import { Product, Category } from '@types/index';

export const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isFavorite = useWishlistStore((state) => state.isFavorite);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesRes, productsRes] = await Promise.all([
        apiClient.getCategories({ per_page: 10 }),
        apiClient.getProducts({ per_page: PAGINATION.PER_PAGE }),
      ]);

      setCategories(categoriesRes.data);
      setFeaturedProducts(productsRes.data);
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const handleAddToCart = (product: Product) => {
    addItem({
      id: `${product.id}`,
      product_id: product.id,
      quantity: 1,
    });
  };

  const handleToggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen />;
  }

  if (error && !refreshing) {
    return <ErrorDisplay message={error} onRetry={fetchData} fullScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Search Header */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search')}
        accessible
        accessibilityLabel="Search products"
      >
        <MaterialCommunityIcons name="magnify" size={20} color={COLORS.TEXT_SECONDARY} />
        <Text style={styles.searchPlaceholder}>Search products...</Text>
      </TouchableOpacity>

      {/* Categories */}
      {categories.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesStack')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {categories.slice(0, 6).map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => navigation.navigate('CategoriesStack')}
              >
                <View style={styles.categoryIconContainer}>
                  <MaterialCommunityIcons
                    name="folder"
                    size={24}
                    color={COLORS.PRIMARY}
                  />
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CategoriesStack')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
              onAddToCart={() => handleAddToCart(product)}
              onAddToWishlist={() => handleToggleFavorite(product)}
              isFavorite={isFavorite(product.id)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_LIGHT,
    marginHorizontal: SPACING.LG,
    marginVertical: SPACING.LG,
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
  },
  searchPlaceholder: {
    marginLeft: SPACING.MD,
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
  },
  section: {
    paddingHorizontal: SPACING.LG,
    marginBottom: SPACING.XL,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  seeAll: {
    color: COLORS.PRIMARY,
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesScroll: {
    marginHorizontal: -SPACING.LG,
    paddingHorizontal: SPACING.LG,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: SPACING.LG,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.GRAY_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SM,
  },
  categoryName: {
    fontSize: 12,
    color: COLORS.TEXT_PRIMARY,
    textAlign: 'center',
    width: 60,
  },
});
