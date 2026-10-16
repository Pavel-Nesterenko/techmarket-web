
function Cart({ cart, onUpdateQuantity, onRemove, onCheckout }) {

    // Форматирование стоимости
    function formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' ₽';
    }

    // Общая стоимость товаров
    const subtotal = cart.reduce((sum, product) => {
        return sum + product.price * product.quantity;
    }, 0);

    // Доставка: 500 ₽, бесплатно от 8000 ₽
    const delivery =
        subtotal > 0 && subtotal < 8000 ? 500 : 0;

    // Итоговая сумма
    const total = subtotal + delivery;

    return (
        <main className="main container">

            <h1 className="mb-4">Корзина</h1>

            <div className="cart-layout">

                {/* Товары в корзине */}
                <section className="cart-items">

                    <h2>Товары в корзине</h2>

                    <div id="cart-items-list">

                        {cart.length === 0 ? (

                            <p>Корзина пуста.</p>

                        ) : (

                            cart.map((product) => (

                                <article
                                    className="cart-item shadow-sm"
                                    key={product.id}
                                >

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                    />

                                    <div className="cart-item-info">

                                        <p className="product-category">
                                            {product.category}
                                        </p>

                                        <h3>{product.name}</h3>

                                        <p>
                                            Цена:{' '}
                                            <strong>
                                                {formatPrice(product.price)}
                                            </strong>
                                        </p>

                                        <div className="cart-actions">

                                            <label
                                                htmlFor={`quantity-${product.id}`}
                                            >
                                                Количество:
                                            </label>

                                            <input
                                                className="form-control cart-quantity"
                                                type="number"
                                                id={`quantity-${product.id}`}
                                                min="1"
                                                value={product.quantity}
                                                onChange={(event) => {
                                                    onUpdateQuantity(
                                                        product.id,
                                                        Number(event.target.value)
                                                    );
                                                }}
                                            />

                                            <button
                                                className="btn btn-outline-danger remove-item"
                                                type="button"
                                                onClick={() => {
                                                    onRemove(product.id);
                                                }}
                                            >
                                                Удалить
                                            </button>

                                        </div>

                                    </div>

                                </article>

                            ))

                        )}

                    </div>

                </section>

                {/* Итоговая стоимость */}
                <section className="cart-summary shadow-sm">

                    <h2>Итого</h2>

                    <p>
                        Товары:
                        <span id="cart-subtotal">
                            {formatPrice(subtotal)}
                        </span>
                    </p>

                    <p>
                        Доставка:
                        <span id="cart-delivery">
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
                            <span id="cart-total">
                                {formatPrice(total)}
                            </span>
                        </strong>
                    </p>

                    <button
                        className="checkout-button btn btn-dark"
                        type="button"
                        disabled={cart.length === 0}
                        onClick={onCheckout}
                    >
                        Оформить заказ
                    </button>

                </section>

            </div>

        </main>
    );
}

export default Cart;
