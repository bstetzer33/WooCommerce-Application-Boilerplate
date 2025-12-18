import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCartStore } from '@store/cartStore';
import { COLORS, SPACING } from '@constants/index';
import { formatPrice } from '@utils/helpers';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { items, removeItem, updateItem, total, subtotal, tax, shipping } = useCartStore();

  const handleRemoveItem = (itemId: string) => {
    Alert.alert('Remove Item', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Remove',
        onPress: () => removeItem(itemId),
        style: 'destructive',
      },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="shopping-cart-outline"
          size={64}
          color={COLORS.GRAY_MEDIUM}
          style={styles.emptyIcon}
        />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add items to get started</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('HomeStack')}
        >
          <Text style={styles.shopButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemImage}>
              <MaterialCommunityIcons
                name="package"
                size={40}
                color={COLORS.GRAY_MEDIUM}
              />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={2}>
                Product ID: {item.product_id}
              </Text>
              <Text style={styles.itemPrice}>${formatPrice(item.quantity * 10)}</Text>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                onPress={() =>
                  updateItem(item.id, Math.max(1, item.quantity - 1))
                }
              >
                <MaterialCommunityIcons
                  name="minus"
                  size={18}
                  color={COLORS.PRIMARY}
                />
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => updateItem(item.id, item.quantity + 1)}
              >
                <MaterialCommunityIcons
                  name="plus"
                  size={18}
                  color={COLORS.PRIMARY}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => handleRemoveItem(item.id)}
              style={styles.removeButton}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={20}
                color={COLORS.ERROR}
              />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          <>
            <View style={styles.divider} />
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>${formatPrice(subtotal || 0)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax:</Text>
                <Text style={styles.summaryValue}>${formatPrice(tax || 0)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping:</Text>
                <Text style={styles.summaryValue}>${formatPrice(shipping || 0)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>${formatPrice(total || 0)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() => {
                // Navigate to checkout
                Alert.alert('Checkout', 'Checkout flow would start here');
              }}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
  },
  listContent: {
    paddingVertical: SPACING.LG,
    paddingHorizontal: SPACING.LG,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: 8,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
  },
  itemImage: {
    width: 60,
    height: 60,
    backgroundColor: COLORS.GRAY_LIGHT,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  itemPrice: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.MD,
  },
  quantity: {
    marginHorizontal: SPACING.SM,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: SPACING.SM,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.BORDER,
    marginVertical: SPACING.LG,
  },
  summaryContainer: {
    marginBottom: SPACING.LG,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MD,
  },
  summaryLabel: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
  },
  summaryValue: {
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
    fontWeight: '600',
  },
  totalRow: {
    marginTop: SPACING.MD,
    paddingTop: SPACING.MD,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
  },
  checkoutButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: SPACING.LG,
    marginBottom: SPACING.LG,
  },
  checkoutButtonText: {
    color: COLORS.BACKGROUND_LIGHT,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.LG,
  },
  emptyIcon: {
    marginBottom: SPACING.LG,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.SM,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
  },
  shopButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderRadius: 8,
  },
  shopButtonText: {
    color: COLORS.BACKGROUND_LIGHT,
    fontSize: 14,
    fontWeight: 'bold',
  },
});
