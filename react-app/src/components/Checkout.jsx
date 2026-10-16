
import { useState } from 'react';

function Checkout({ cart, onOrderComplete }) {

    // Состояние полей формы
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        deliveryMethod: 'delivery',
        address: ''
    });

    // Ошибки проверки полей
    const [errors, setErrors] = useState({});

    // Сообщение о результате оформления
    const [orderMessage, setOrderMessage] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);

    // Форматирование цены
    function formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' ₽';
    }

    // Стоимость товаров
    const subtotal = cart.reduce((sum, product) => {
        return sum + product.price * product.quantity;
    }, 0);

    // Стоимость доставки
    const delivery =
        subtotal === 0 ||
        formData.deliveryMethod === 'pickup' ||
        subtotal >= 8000
            ? 0
            : 500;

    const total = subtotal + delivery;

    // Изменение полей формы
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

    // Проверка отдельного поля
    function validateField(fieldName, value) {

        const trimmedValue = value.trim();

        if (fieldName === 'name') {

            if (trimmedValue.length === 0) {
                return 'Введите имя.';
            }

            const namePattern = /^[A-Za-zА-Яа-яЁё\s-]{2,}$/;

            if (!namePattern.test(trimmedValue)) {
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

            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(trimmedValue)) {
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

    // Проверка поля после потери фокуса
    function handleBlur(event) {

        const { name, value } = event.target;

        const error = validateField(name, value);

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: error
        }));
    }

    // Выбор способа получения
    function handleDeliveryChange(event) {

        const method = event.target.value;

        setFormData((previousData) => ({
            ...previousData,
            deliveryMethod: method
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            address: ''
        }));
    }

    // Отправка заказа
    function handleSubmit(event) {

        event.preventDefault();

        setOrderMessage('');
        setOrderSuccess(false);

        const newErrors = {
            name: validateField('name', formData.name),
            phone: validateField('phone', formData.phone),
            email: validateField('email', formData.email),
            address: validateField('address', formData.address)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(
            (error) => error !== ''
        );

        if (hasErrors) {
            setOrderMessage('Исправьте ошибки в форме.');
            return;
        }

        if (cart.length === 0) {
            setOrderMessage(
                'Невозможно оформить заказ: корзина пуста.'
            );
            return;
        }

        // Демонстрационный заказ
        const order = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim(),
            deliveryMethod: formData.deliveryMethod,
            address:
                formData.deliveryMethod === 'pickup'
                    ? ''
                    : formData.address.trim(),
            products: cart,
            subtotal,
            delivery,
            total
        };

        console.log('Демонстрационный заказ:', order);

        setOrderMessage(
            'Заказ успешно оформлен! Это демонстрационный заказ.'
        );

        setOrderSuccess(true);

        // Очищаем корзину через App
        onOrderComplete();

        // Очищаем форму
        setFormData({
            name: '',
            phone: '',
            email: '',
            deliveryMethod: 'delivery',
            address: ''
        });

        setErrors({});
    }

    return (
        <main className="main container">

            <h1 className="mb-4">
                Оформление заказа
            </h1>

            <form
                className="checkout-form"
                id="checkout-form"
                noValidate
                onSubmit={handleSubmit}
            >

                <section className="checkout-data shadow-sm">

                    <h2>Контактные данные</h2>

                    {/* Имя */}
                    <div className="form-group">

                        <label htmlFor="name">Имя:</label>

                        <input
                            className={`form-control ${
                                errors.name ? 'is-invalid' : ''
                            }`}
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

                    {/* Телефон */}
                    <div className="form-group">

                        <label htmlFor="phone">Телефон:</label>

                        <input
                            className={`form-control ${
                                errors.phone ? 'is-invalid' : ''
                            }`}
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

                    {/* Email */}
                    <div className="form-group">

                        <label htmlFor="email">E-mail:</label>

                        <input
                            className={`form-control ${
                                errors.email ? 'is-invalid' : ''
                            }`}
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

                    {/* Способ получения */}
                    <fieldset className="delivery-method">

                        <legend>Способ получения</legend>

                        <div className="form-check">

                            <input
                                className="form-check-input"
                                type="radio"
                                id="delivery"
                                name="delivery-method"
                                value="delivery"
                                checked={
                                    formData.deliveryMethod === 'delivery'
                                }
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
                                checked={
                                    formData.deliveryMethod === 'pickup'
                                }
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

                    {/* Адрес отображается только при доставке */}
                    {formData.deliveryMethod === 'delivery' && (

                        <div
                            className="form-group"
                            id="address-group"
                        >

                            <label htmlFor="address">
                                Адрес доставки:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.address ? 'is-invalid' : ''
                                }`}
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

                {/* Информация о заказе */}
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
                        disabled={cart.length === 0}
                    >
                        Заказать
                    </button>

                </section>

            </form>

        </main>
    );
}

export default Checkout;
