import { useCartStore } from '@store/cartStore';

describe('Cart Store', () => {
  beforeEach(() => {
    const { clearCart } = useCartStore.getState();
    clearCart();
  });

  test('should add item to cart', () => {
    const { addItem, items } = useCartStore.getState();
    addItem({ id: '1', product_id: 1, quantity: 1 });
    expect(useCartStore.getState().items.length).toBe(1);
  });

  test('should remove item from cart', () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem({ id: '1', product_id: 1, quantity: 1 });
    removeItem('1');
    expect(useCartStore.getState().items.length).toBe(0);
  });

  test('should update item quantity', () => {
    const { addItem, updateItem } = useCartStore.getState();
    addItem({ id: '1', product_id: 1, quantity: 1 });
    updateItem('1', 5);
    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });

  test('should clear cart', () => {
    const { addItem, clearCart } = useCartStore.getState();
    addItem({ id: '1', product_id: 1, quantity: 1 });
    clearCart();
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
