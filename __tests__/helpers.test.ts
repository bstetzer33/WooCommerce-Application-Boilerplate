import { formatPrice, calculateDiscount, isValidEmail, generateUniqueId } from '@utils/helpers';

describe('Helper Functions', () => {
  test('formatPrice should format numbers correctly', () => {
    expect(formatPrice(10.5)).toBe('10.50');
    expect(formatPrice('25.999')).toBe('26.00');
  });

  test('calculateDiscount should calculate percentage correctly', () => {
    expect(calculateDiscount(100, 80)).toBe(20);
    expect(calculateDiscount(50, 50)).toBe(0);
  });

  test('isValidEmail should validate emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid.email')).toBe(false);
    expect(isValidEmail('user@domain.co.uk')).toBe(true);
  });

  test('generateUniqueId should generate unique strings', () => {
    const id1 = generateUniqueId();
    const id2 = generateUniqueId();
    expect(id1).not.toBe(id2);
    expect(typeof id1).toBe('string');
  });
});
