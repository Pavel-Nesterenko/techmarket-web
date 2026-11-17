
const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validateOrder,
  validateSupport,
  calculateOrderTotals
} = require('./index');

// Корректные исходные данные для проверки заказа
const validOrder = {
  name: 'Иван Иванов',
  phone: '+7 (999) 123-45-67',
  email: 'ivan@example.com',
  deliveryMethod: 'delivery',
  address: 'Москва, улица Ленина, дом 10',
  items: [
    { id: 1, quantity: 2 }
  ]
};

// TC-08: Расчёт стоимости товаров
test('TC-08: стоимость двух товаров по 1990 рублей', () => {
  const result = calculateOrderTotals(
    [{ price: 1990, quantity: 2 }],
    'delivery'
  );

  assert.equal(result.subtotal, 3980);
  assert.equal(result.delivery, 500);
  assert.equal(result.total, 4480);
});

// TC-09: Корректные данные покупателя
test('TC-09: корректные данные заказа проходят проверку', () => {
  const result = validateOrder(validOrder);

  assert.equal(result, null);
});

// TC-10: Пустое обязательное поле
test('TC-10: пустое имя покупателя отклоняется', () => {
  const result = validateOrder({
    ...validOrder,
    name: ''
  });

  assert.equal(result, 'Введите корректное имя.');
});

// TC-11: Платная доставка
test('TC-11: доставка при сумме меньше 8000 рублей', () => {
  const result = calculateOrderTotals(
    [{ price: 3980, quantity: 1 }],
    'delivery'
  );

  assert.equal(result.delivery, 500);
  assert.equal(result.total, 4480);
});

// TC-12: Бесплатная доставка от 8000 рублей
test('TC-12: доставка при сумме 8000 рублей бесплатна', () => {
  const result = calculateOrderTotals(
    [{ price: 4000, quantity: 2 }],
    'delivery'
  );

  assert.equal(result.subtotal, 8000);
  assert.equal(result.delivery, 0);
  assert.equal(result.total, 8000);
});

// TC-13: Бесплатный самовывоз
test('TC-13: самовывоз бесплатен', () => {
  const result = calculateOrderTotals(
    [{ price: 1990, quantity: 2 }],
    'pickup'
  );

  assert.equal(result.delivery, 0);
  assert.equal(result.total, 3980);
});

// TC-16: Некорректные данные обращения
test('TC-16: обращение с коротким сообщением отклоняется', () => {
  const result = validateSupport({
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    subject: 'Вопрос по заказу',
    message: 'Привет'
  });

  assert.equal(
    result,
    'Сообщение должно содержать от 10 до 5000 символов.'
  );
});
