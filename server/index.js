
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Преобразование товара из PostgreSQL в формат React
function formatProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    description: row.description,
    image: row.image,
    fullDescription: row.full_description,
    specifications: row.specifications
  };
}

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

// Проверка подключения к PostgreSQL
app.get('/api/db-test', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT current_database() AS database, NOW() AS server_time'
    );

    res.json({
      success: true,
      message: 'PostgreSQL подключён!',
      ...result.rows[0]
    });
  } catch (error) {
    next(error);
  }
});

// Получение всех товаров
app.get('/api/products', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products ORDER BY id'
    );

    res.json(result.rows.map(formatProduct));
  } catch (error) {
    next(error);
  }
});

// Получение одного товара
app.get('/api/products/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
      return res.status(400).json({
        message: 'Некорректный ID товара.'
      });
    }

    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: 'Товар не найден'
      });
    }

    res.json(formatProduct(result.rows[0]));
  } catch (error) {
    next(error);
  }
});

// Оформление заказа
app.post('/api/orders', async (req, res, next) => {
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

  let client;

  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const orderItems = [];

    for (const item of items) {
      if (
        !item ||
        !Number.isSafeInteger(item.id) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          message: 'Некорректное количество или ID товара.'
        });
      }

      const productResult = await client.query(
        'SELECT id, name, price FROM products WHERE id = $1',
        [item.id]
      );

      if (productResult.rows.length === 0) {
        await client.query('ROLLBACK');

        return res.status(400).json({
          message: `Товар с ID ${item.id} не найден.`
        });
      }

      const product = productResult.rows[0];

      const existingItem = orderItems.find(
        (orderItem) => orderItem.id === product.id
      );

      if (existingItem) {
        if (existingItem.quantity + item.quantity > 100) {
          await client.query('ROLLBACK');

          return res.status(400).json({
            message: 'Превышено допустимое количество товара.'
          });
        }

        existingItem.quantity += item.quantity;
      } else {
        orderItems.push({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: item.quantity
        });
      }
    }

    // Сервер самостоятельно рассчитывает стоимость
    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const delivery =
      deliveryMethod === 'pickup' || subtotal >= 8000
        ? 0
        : 500;

    const total = subtotal + delivery;

    // Сохранение заказа
    const orderResult = await client.query(
      `INSERT INTO orders
        (customer_name, customer_email, customer_phone, total, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        name.trim(),
        email.trim(),
        phone.trim(),
        total,
        'new'
      ]
    );

    const orderId = orderResult.rows[0].id;

    // Сохранение товаров заказа
    for (const item of orderItems) {
      await client.query(
        `INSERT INTO order_items
          (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [orderId, item.id, item.quantity, item.price]
      );
    }

    await client.query('COMMIT');

    console.log(
      `Создан заказ №${orderId}, сумма: ${total} ₽`
    );

    return res.status(201).json({
      success: true,
      message: 'Заказ успешно оформлен!',
      orderId,
      subtotal,
      delivery,
      total
    });
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK').catch(console.error);
    }

    next(error);
  } finally {
    if (client) {
      client.release();
    }
  }
});

// Количество заказов
app.get('/api/orders/count', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*)::int AS count FROM orders'
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Создание обращения в поддержку
app.post('/api/support', async (req, res, next) => {
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

  try {
    // Названия столбцов соответствуют таблице PostgreSQL
    const result = await pool.query(
      `INSERT INTO support_requests
        (customer_name, customer_email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [
        name.trim(),
        email.trim(),
        subject.trim(),
        message.trim()
      ]
    );

    const requestId = result.rows[0].id;

    console.log(
      `Получено обращение в поддержку №${requestId}`
    );

    return res.status(201).json({
      success: true,
      message: 'Ваше обращение успешно отправлено!',
      requestId
    });
  } catch (error) {
    next(error);
  }
});

// Количество обращений
app.get('/api/support/count', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT COUNT(*)::int AS count FROM support_requests'
    );

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Неизвестные API-маршруты
app.use('/api', (req, res) => {
  res.status(404).json({
    message: 'API-маршрут не найден.'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err);

  res.status(err.status || 500).json({
    message:
      err.status === 400
        ? 'Некорректный формат запроса.'
        : 'Внутренняя ошибка сервера.'
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(
    `Сервер TechMarket запущен: http://localhost:${PORT}`
  );
});
