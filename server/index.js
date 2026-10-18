
const express = require('express');
const cors = require('cors');
const products = require('./data/products');

const app = express();
const PORT = 3001;

// Временное хранение данных до подключения базы данных
const orders = [];
const supportRequests = [];

let nextOrderId = 1;
let nextSupportId = 1;

app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Проверка сервера
app.get('/', (req, res) => {
  res.send('Сервер TechMarket работает!');
});

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Привет от сервера TechMarket!',
    success: true
  });
});

// Получение всех товаров
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Получение одного товара
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({
      message: 'Товар не найден'
    });
  }

  res.json(product);
});

// Оформление заказа
app.post('/api/orders', (req, res) => {
  const data = req.body;

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({
      message: 'Некорректные данные заказа.'
    });
  }

  const {
    name,
    phone,
    email,
    deliveryMethod,
    address,
    items
  } = data;

  if (
    typeof name !== 'string' ||
    !/^[A-Za-zА-Яа-яЁё\s-]{2,}$/.test(name.trim())
  ) {
    return res.status(400).json({
      message: 'Введите корректное имя.'
    });
  }

  if (
    typeof phone !== 'string' ||
    !/^\d{10,15}$/.test(phone.replace(/\D/g, ''))
  ) {
    return res.status(400).json({
      message: 'Введите корректный номер телефона.'
    });
  }

  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      message: 'Введите корректный E-mail.'
    });
  }

  if (!['delivery', 'pickup'].includes(deliveryMethod)) {
    return res.status(400).json({
      message: 'Выберите способ получения заказа.'
    });
  }

  if (
    deliveryMethod === 'delivery' &&
    (typeof address !== 'string' || address.trim().length < 5)
  ) {
    return res.status(400).json({
      message: 'Введите адрес доставки.'
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: 'Корзина пуста.'
    });
  }

  const orderItems = [];

  for (const item of items) {
    if (
      !item ||
      !Number.isSafeInteger(item.id) ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
      return res.status(400).json({
        message: 'Некорректное количество или ID товара.'
      });
    }

    const product = products.find(
      (product) => product.id === item.id
    );

    if (!product) {
      return res.status(400).json({
        message: `Товар с ID ${item.id} не найден.`
      });
    }

    const existingItem = orderItems.find(
      (orderItem) => orderItem.id === product.id
    );

    if (existingItem) {
      if (existingItem.quantity + item.quantity > 100) {
        return res.status(400).json({
          message: 'Превышено допустимое количество товара.'
        });
      }

      existingItem.quantity += item.quantity;
    } else {
      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }
  }

  // Сервер самостоятельно рассчитывает сумму заказа
  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const delivery =
    deliveryMethod === 'pickup' || subtotal >= 8000
      ? 0
      : 500;

  const total = subtotal + delivery;

  const order = {
    id: nextOrderId++,
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    deliveryMethod,
    address:
      deliveryMethod === 'pickup' ? '' : address.trim(),
    items: orderItems,
    subtotal,
    delivery,
    total,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  orders.push(order);

  console.log(
    `Создан заказ №${order.id}, сумма: ${order.total} ₽`
  );

  return res.status(201).json({
    success: true,
    message: 'Заказ успешно оформлен!',
    orderId: order.id,
    subtotal: order.subtotal,
    delivery: order.delivery,
    total: order.total
  });
});

// Количество заказов — учебная проверка
app.get('/api/orders/count', (req, res) => {
  res.json({
    count: orders.length
  });
});

// Создание обращения в поддержку
app.post('/api/support', (req, res) => {
  const data = req.body;

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return res.status(400).json({
      message: 'Некорректные данные обращения.'
    });
  }

  const { name, email, subject, message } = data;

  if (
    typeof name !== 'string' ||
    !/^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/.test(name.trim()) ||
    name.trim().replace(/[^A-Za-zА-Яа-яЁё]/g, '').length < 2
  ) {
    return res.status(400).json({
      message: 'Введите корректное имя (минимум 2 буквы).'
    });
  }

  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return res.status(400).json({
      message: 'Введите корректный E-mail.'
    });
  }

  if (
    typeof subject !== 'string' ||
    subject.trim().length < 3 ||
    subject.trim().length > 200
  ) {
    return res.status(400).json({
      message: 'Тема обращения должна содержать от 3 до 200 символов.'
    });
  }

  if (
    typeof message !== 'string' ||
    message.trim().length < 10 ||
    message.trim().length > 5000
  ) {
    return res.status(400).json({
      message: 'Сообщение должно содержать от 10 до 5000 символов.'
    });
  }

  const supportRequest = {
    id: nextSupportId++,
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
    status: 'new',
    createdAt: new Date().toISOString()
  };

  supportRequests.push(supportRequest);

  console.log(
    `Получено обращение в поддержку №${supportRequest.id}`
  );

  return res.status(201).json({
    success: true,
    message: 'Ваше обращение успешно отправлено!',
    requestId: supportRequest.id
  });
});

// Количество обращений — учебная проверка
app.get('/api/support/count', (req, res) => {
  res.json({
    count: supportRequests.length
  });
});

// Неизвестные маршруты API
app.use('/api', (req, res) => {
  res.status(404).json({
    message: 'API-маршрут не найден.'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.message);

  res.status(err.status || 500).json({
    message:
      err.status === 400
        ? 'Некорректный формат запроса.'
        : 'Внутренняя ошибка сервера.'
  });
});

app.listen(PORT, () => {
  console.log(
    `Сервер TechMarket запущен: http://localhost:${PORT}`
  );
});
