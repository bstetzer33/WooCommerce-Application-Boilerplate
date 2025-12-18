import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import apiClient from '@services/api';
import { COLORS, SPACING, PAGINATION } from '@constants/index';
import { ProductCard } from '@components/ProductCard';
import { ErrorDisplay } from '@components/ErrorDisplay';
import { handleApiError } from '@utils/errorHandler';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { Product, Category } from '@types';

export const CategoriesScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const isFavorite = useWishlistStore((state) => state.isFavorite);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getCategories({ per_page: 100 });
      setCategories(response.data);
      if (response.data.length > 0) {
        setSelectedCategory(response.data[0].id);
      }
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchProducts(selectedCategory, 1);
    }
  }, [selectedCategory]);

  const fetchProducts = async (categoryId: number, pageNum: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProducts({
        category: categoryId,
        per_page: PAGINATION.PER_PAGE,
        page: pageNum,
      });
      if (pageNum === 1) {
        setProducts(response.data);
      } else {
        setProducts((prev) => [...prev, ...response.data]);
      }
      setPage(pageNum);
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (selectedCategory && !loading) {
      fetchProducts(selectedCategory, page + 1);
    }
  };

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

  return (
    <View style={styles.container}>
      {/* Category Tabs */}
      {categories.length > 0 && (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabs}
          contentContainerStyle={styles.categoryTabsContent}
          renderItem={({ item: category }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                selectedCategory === category.id && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                setPage(1);
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === category.id && styles.activeTabText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Products Grid */}
      {error ? (
        <ErrorDisplay message={error} onRetry={() => selectedCategory && fetchProducts(selectedCategory, 1)} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item: product }) => (
            <View style={styles.productWrapper}>
              <ProductCard
                product={product}
                onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
                onAddToCart={() => handleAddToCart(product)}
                onAddToWishlist={() => handleToggleFavorite(product)}
                isFavorite={isFavorite(product.id)}
              />
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator color={COLORS.PRIMARY} style={styles.footer} /> : null
          }
          scrollEventThrottle={400}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  categoryTabs: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  categoryTabsContent: {
    paddingHorizontal: SPACING.LG,
  },
  tab: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.PRIMARY,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.SM,
    marginBottom: SPACING.SM,
  },
  productWrapper: {
    width: '48%',
  },
  listContent: {
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.MD,
  },
  footer: {
    paddingVertical: SPACING.LG,
  },
});
