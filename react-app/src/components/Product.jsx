
import { useEffect, useState } from 'react';

function Product({ product, onAddToCart }) {

    // Количество выбранного товара
    const [quantity, setQuantity] = useState('1');

    // Сообщение о добавлении
    const [productMessage, setProductMessage] = useState('');

    // Ошибка при вводе количества
    const [quantityError, setQuantityError] = useState(false);

    // Обновление названия вкладки браузера
    useEffect(() => {

        document.title = product
            ? `${product.name} — TechMarket`
            : 'Товар не найден — TechMarket';

        return () => {
            document.title = 'TechMarket';
        };

    }, [product]);

    // Если товар не найден
    if (!product) {
        return (
            <main className="main container">

                <div
                    className="alert alert-danger"
                    role="alert"
                >
                    Товар не найден.{' '}
                    <a href="#catalog">
                        Вернуться в каталог
                    </a>
                </div>

            </main>
        );
    }

    // Обработка изменения количества
    function handleQuantityChange(event) {

        setQuantity(event.target.value);

        setProductMessage('');
        setQuantityError(false);
    }

    // Добавление в корзину
    function handleSubmit(event) {

        event.preventDefault();

        const selectedQuantity = Number(quantity);

        // Проверка количества
        if (
            !Number.isSafeInteger(selectedQuantity) ||
            selectedQuantity < 1
        ) {

            setProductMessage(
                'Введите корректное количество товара.'
            );

            setQuantityError(true);

            return;
        }

        // Передаём товар и количество в App.jsx
        onAddToCart(product, selectedQuantity);

        setProductMessage('Товар добавлен в корзину!');
        setQuantityError(false);

        console.log(
            'Добавлен товар:',
            product.name,
            'Количество:',
            selectedQuantity
        );
    }

    return (
        <main className="main container">

            <article className="product-page">

                {/* Изображение товара */}
                <div className="product-image shadow-sm">

                    <img
                        src={product.image}
                        alt={product.name}
                    />

                </div>

                {/* Информация о товаре */}
                <div className="product-info">

                    <p className="product-category">
                        {product.category}
                    </p>

                    <h1>
                        {product.name}
                    </h1>

                    <p className="product-code">
                        Артикул: TM-{String(product.id).padStart(3, '0')}
                    </p>

                    <p className="product-price">
                        <strong>
                            {product.price.toLocaleString('ru-RU')} ₽
                        </strong>
                    </p>

                    <p className="product-stock">
                        В наличии
                    </p>

                    {/* Выбор количества */}
                    <form
                        className="cart-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <label htmlFor="quantity">
                            Количество:
                        </label>

                        <input
                            className={`form-control ${
                                quantityError ? 'is-invalid' : ''
                            }`}
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            min="1"
                            step="1"
                            onChange={handleQuantityChange}
                            required
                        />

                        <button
                            className="btn btn-dark"
                            type="submit"
                        >
                            Добавить в корзину
                        </button>

                    </form>

                    {/* Сообщение о результате */}
                    <div
                        className={`mt-3 ${
                            quantityError
                                ? 'text-danger'
                                : 'text-success'
                        }`}
                        role="status"
                        aria-live="polite"
                    >
                        {productMessage}

                        {!quantityError && productMessage && (
                            <>
                                {' '}
                                <a href="#cart">
                                    Перейти в корзину
                                </a>
                            </>
                        )}
                    </div>

                </div>

                {/* Описание */}
                <section className="product-description shadow-sm">

                    <h2>Описание</h2>

                    <p>
                        {product.fullDescription}
                    </p>

                </section>

                {/* Характеристики */}
                <section className="product-specifications shadow-sm">

                    <h2>Характеристики</h2>

                    <table className="table">

                        <tbody>

                            {Object.entries(
                                product.specifications || {}
                            ).map(([characteristic, value]) => (

                                <tr key={characteristic}>

                                    <th scope="row">
                                        {characteristic}
                                    </th>

                                    <td>
                                        {value}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </section>

            </article>

        </main>
    );
}

export default Product;
