
import { useState } from 'react';

const API_URL = 'http://localhost:3001';

function Checkout({ cart, onOrderComplete }) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        deliveryMethod: 'delivery',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [orderMessage, setOrderMessage] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    function formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' ₽';
    }

    const subtotal = cart.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
    );

    const delivery =
        subtotal === 0 ||
        formData.deliveryMethod === 'pickup' ||
        subtotal >= 8000
            ? 0
            : 500;

    const total = subtotal + delivery;

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: ''
        }));
    }

    function validateField(fieldName, value) {
        const trimmedValue = value.trim();

        if (fieldName === 'name') {
            if (trimmedValue.length === 0) {
                return 'Введите имя.';
            }

            if (!/^[A-Za-zА-Яа-яЁё\s-]{2,}$/.test(trimmedValue)) {
                return 'Имя должно содержать минимум 2 буквы.';
            }
        }

        if (fieldName === 'phone') {
            const digits = trimmedValue.replace(/\D/g, '');

            if (digits.length < 10 || digits.length > 15) {
                return 'Введите корректный телефон: от 10 до 15 цифр.';
            }
        }

        if (fieldName === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
                return 'Введите корректный E-mail.';
            }
        }

        if (fieldName === 'address') {
            if (formData.deliveryMethod === 'pickup') {
                return '';
            }

            if (trimmedValue.length < 5) {
                return 'Введите адрес доставки (минимум 5 символов).';
            }
        }

        return '';
    }

    function handleBlur(event) {
        const { name, value } = event.target;

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: validateField(name, value)
        }));
    }

    function handleDeliveryChange(event) {
        setFormData((previousData) => ({
            ...previousData,
            deliveryMethod: event.target.value
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            address: ''
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setOrderMessage('');
        setOrderSuccess(false);

        const newErrors = {
            name: validateField('name', formData.name),
            phone: validateField('phone', formData.phone),
            email: validateField('email', formData.email),
            address: validateField('address', formData.address)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== '')) {
            setOrderMessage('Исправьте ошибки в форме.');
            return;
        }

        if (cart.length === 0) {
            setOrderMessage('Невозможно оформить заказ: корзина пуста.');
            return;
        }

        const orderData = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            deliveryMethod: formData.deliveryMethod,
            address:
                formData.deliveryMethod === 'pickup'
                    ? ''
                    : formData.address.trim(),
            items: cart.map((product) => ({
                id: product.id,
                quantity: product.quantity
            }))
        };

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Не удалось оформить заказ.'
                );
            }

            setOrderMessage(
                `Заказ №${result.orderId} успешно оформлен! ` +
                `Сумма: ${formatPrice(result.total)}.`
            );
            setOrderSuccess(true);

            // Корзину очищаем только после ответа сервера
            onOrderComplete();

            setFormData({
                name: '',
                phone: '',
                email: '',
                deliveryMethod: 'delivery',
                address: ''
            });

            setErrors({});
        } catch (error) {
            setOrderMessage(
                error instanceof TypeError
                    ? 'Не удалось подключиться к серверу. Проверьте, запущен ли Node.js.'
                    : error.message
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="main container">
            <h1 className="mb-4">Оформление заказа</h1>

            <form
                className="checkout-form"
                id="checkout-form"
                noValidate
                onSubmit={handleSubmit}
            >
                <section className="checkout-data shadow-sm">
                    <h2>Контактные данные</h2>

                    <div className="form-group">
                        <label htmlFor="name">Имя:</label>
                        <input
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Имя"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <div className="invalid-feedback">
                            {errors.name}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон:</label>
                        <input
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            type="tel"
                            id="phone"
                            name="phone"
                            placeholder="+7 999 123-45-67"
                            value={formData.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <div className="invalid-feedback">
                            {errors.phone}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            type="email"
                            id="email"
                            name="email"
                            placeholder="example@mail.ru"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                        />
                        <div className="invalid-feedback">
                            {errors.email}
                        </div>
                    </div>

                    <fieldset className="delivery-method">
                        <legend>Способ получения</legend>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="delivery"
                                name="delivery-method"
                                value="delivery"
                                checked={formData.deliveryMethod === 'delivery'}
                                onChange={handleDeliveryChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="delivery"
                            >
                                Доставка
                            </label>
                        </div>

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="pickup"
                                name="delivery-method"
                                value="pickup"
                                checked={formData.deliveryMethod === 'pickup'}
                                onChange={handleDeliveryChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor="pickup"
                            >
                                Самовывоз
                            </label>
                        </div>
                    </fieldset>

                    {formData.deliveryMethod === 'delivery' && (
                        <div className="form-group" id="address-group">
                            <label htmlFor="address">
                                Адрес доставки:
                            </label>
                            <input
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                type="text"
                                id="address"
                                name="address"
                                placeholder="Город, улица, дом"
                                value={formData.address}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />
                            <div className="invalid-feedback">
                                {errors.address}
                            </div>
                        </div>
                    )}
                </section>

                <section className="order-summary shadow-sm">
                    <h2>Ваш заказ</h2>

                    <ul
                        className="list-group mb-4"
                        id="order-items"
                    >
                        {cart.length === 0 ? (
                            <li className="list-group-item">
                                Корзина пуста.
                            </li>
                        ) : (
                            cart.map((product) => (
                                <li
                                    className="list-group-item"
                                    key={product.id}
                                >
                                    {product.name}
                                    {' × '}
                                    {product.quantity}
                                    {' — '}
                                    {formatPrice(
                                        product.price * product.quantity
                                    )}
                                </li>
                            ))
                        )}
                    </ul>

                    <div className="order-price">
                        <p>
                            Товары:
                            <span id="order-subtotal">
                                {formatPrice(subtotal)}
                            </span>
                        </p>

                        <p>
                            Доставка:
                            <span id="order-delivery">
                                {delivery === 0
                                    ? 'Бесплатно'
                                    : formatPrice(delivery)}
                            </span>
                        </p>

                        <p className="delivery-info">
                            Бесплатная доставка при заказе от 8 000 ₽
                        </p>

                        <p className="cart-total">
                            <strong>
                                К оплате:
                                <span id="order-total">
                                    {formatPrice(total)}
                                </span>
                            </strong>
                        </p>
                    </div>

                    {orderMessage && (
                        <div
                            id="order-message"
                            className={`mt-3 ${
                                orderSuccess
                                    ? 'text-success'
                                    : 'text-danger'
                            }`}
                            role="status"
                            aria-live="polite"
                        >
                            {orderMessage}
                        </div>
                    )}

                    <button
                        className="order-button btn btn-dark"
                        type="submit"
                        id="submit-order"
                        disabled={cart.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Оформляем...' : 'Заказать'}
                    </button>
                </section>
            </form>
        </main>
    );
}

export default Checkout;
