import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import apiClient from '@services/api';
import { COLORS, SPACING } from '@constants/index';
import { ProductCard } from '@components/ProductCard';
import { handleApiError } from '@utils/errorHandler';
import { useCartStore } from '@store/cartStore';
import { useWishlistStore } from '@store/wishlistStore';
import { Product } from '@types/index';
import { debounce } from '@utils/helpers';

export const SearchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);
  const isFavorite = useWishlistStore((state) => state.isFavorite);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);

  const performSearch = async (term: string) => {
    if (term.trim().length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.searchProducts(term);
      setResults(response.data);
    } catch (err) {
      const error = handleApiError(err);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(performSearch, 500);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
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
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={COLORS.TEXT_SECONDARY} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={handleSearch}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          accessible
          accessibilityLabel="Search input"
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => { setSearchTerm(''); setResults([]); }}>
            <MaterialCommunityIcons name="close" size={20} color={COLORS.TEXT_SECONDARY} />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator color={COLORS.PRIMARY} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : results.length === 0 && searchTerm.length >= 2 ? (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={48}
            color={COLORS.GRAY_MEDIUM}
            style={styles.emptyIcon}
          />
          <Text style={styles.emptyText}>No products found</Text>
        </View>
      ) : (
        <FlatList
          data={results}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.GRAY_LIGHT,
    marginHorizontal: SPACING.LG,
    marginVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: SPACING.MD,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.ERROR,
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
});
