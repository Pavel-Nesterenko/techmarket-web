
import { useEffect, useState } from 'react';

import ProductCard from './components/ProductCard.jsx';
import Product from './components/Product.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './components/Checkout.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Support from './components/Support.jsx';
import Account from './components/Account.jsx';

const CART_STORAGE_KEY = 'techmarket_cart';

// Данные товаров
const products = [
    {
        id: 1,
        name: 'Смарт ТВ приставка',
        category: 'TV Box',
        price: 4990,
        description: '4K Ultra HD, 8/128 ГБ, Android',
        image: '/images/product1.jpeg',
        fullDescription:
            'Смарт ТВ приставка предназначена для просмотра ' +
            'мультимедийного контента и использования приложений ' +
            'на телевизоре.',
        specifications: {
            'Операционная система': 'Android TV 15',
            'Процессор': 'Cortex A53',
            'Оперативная память': '8 ГБ',
            'Встроенная память': '128 ГБ',
            'Разрешение': '4K Ultra HD'
        }
    },
    {
        id: 2,
        name: 'Смарт ТВ приставка Mini',
        category: 'TV Stick',
        price: 2990,
        description: 'Full HD, 2/16 ГБ, Android',
        image: '/images/product2.jpeg',
        fullDescription:
            'Компактная смарт ТВ приставка Mini позволяет ' +
            'смотреть видео и пользоваться приложениями ' +
            'на телевизоре. Поддерживает разрешение Full HD.',
        specifications: {
            'Операционная система': 'Android',
            'Тип устройства': 'TV Stick',
            'Оперативная память': '2 ГБ',
            'Встроенная память': '16 ГБ',
            'Разрешение': 'Full HD'
        }
    },
    {
        id: 3,
        name: 'Цифровой ТВ ресивер',
        category: 'TV ресивер',
        price: 1990,
        description: 'DVB-T2, HDMI, USB',
        image: '/images/product1.jpeg',
        fullDescription:
            'Цифровой ТВ ресивер предназначен для приёма ' +
            'цифрового эфирного телевидения DVB-T2. ' +
            'Оснащён разъёмами HDMI и USB.',
        specifications: {
            'Стандарт телевидения': 'DVB-T2',
            'Подключение': 'HDMI',
            'USB': 'Есть',
            'Тип устройства': 'Цифровой ТВ ресивер'
        }
    }
];

// Загрузка корзины из localStorage
function loadCart() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];

        if (!Array.isArray(parsedCart)) {
            return [];
        }

        return parsedCart.filter((item) =>
            item &&
            Number.isFinite(item.id) &&
            Number.isFinite(item.price) &&
            Number.isSafeInteger(item.quantity) &&
            item.quantity >= 1
        );
    } catch (error) {
        console.error('Ошибка загрузки корзины:', error);
        return [];
    }
}

// Определение текущей страницы
function getPageFromHash() {
    const hash = window.location.hash;

    if (hash === '#cart') {
        return 'cart';
    }

    if (hash === '#checkout') {
        return 'checkout';
    }

    if (hash === '#login') {
        return 'login';
    }

    if (hash === '#register') {
        return 'register';
    }

    if (hash === '#support') {
        return 'support';
    }

    if (hash === '#account') {
        return 'account';
    }

    if (hash.startsWith('#product/')) {
        return 'product';
    }

    return 'catalog';
}

// Получение ID выбранного товара из адреса
function getProductIdFromHash() {
    const hash = window.location.hash;

    const match = hash.match(/^#product\/(\d+)$/);

    if (!match) {
        return null;
    }

    const productId = Number(match[1]);

    return Number.isSafeInteger(productId)
        ? productId
        : null;
}

// Шапка сайта
function Header({
    searchInput,
    setSearchInput,
    onSearch,
    cartCount
}) {

    function handleSubmit(event) {
        event.preventDefault();
        onSearch();
        window.location.hash = '#catalog';
    }

    return (
        <header className="header">

            <a className="logo" href="#catalog">
                TechMarket
            </a>

            <nav className="nav">

                <a href="#catalog">
                    Каталог
                </a>

                <a href="#support">
                    Поддержка
                </a>

                <a href="#account">
                    Личный кабинет
                </a>

                <a href="#cart">
                    Корзина ({cartCount})
                </a>

            </nav>

            <form className="search" onSubmit={handleSubmit}>

                <label htmlFor="search">
                    Поиск товаров
                </label>

                <input
                    type="search"
                    id="search"
                    name="search"
                    placeholder="Поиск"
                    value={searchInput}
                    onChange={(event) =>
                        setSearchInput(event.target.value)
                    }
                />

                <button type="submit">
                    Найти
                </button>

            </form>

        </header>
    );
}

// Фильтры каталога
function Filters({
    selectedCategory,
    setSelectedCategory,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo
}) {

    const categories = [
        'Все товары',
        'TV Stick',
        'TV Box',
        'TV ресивер'
    ];

    return (
        <aside className="col-12 col-md-4 col-lg-3">

            <div className="filters shadow-sm">

                <h2>Фильтры</h2>

                <div className="filter-group">

                    <h3>Категории</h3>

                    <ul>

                        {categories.map((category) => (

                            <li key={category}>

                                <a
                                    href="#catalog"
                                    onClick={() =>
                                        setSelectedCategory(category)
                                    }
                                    style={{
                                        fontWeight:
                                            selectedCategory === category
                                                ? 'bold'
                                                : 'normal'
                                    }}
                                >
                                    {category}
                                </a>

                            </li>

                        ))}

                    </ul>

                </div>

                <div className="filter-group">

                    <h3>Цена, ₽</h3>

                    <div className="price-fields">

                        <div className="price-field">

                            <label htmlFor="price-from">
                                От
                            </label>

                            <input
                                className="form-control"
                                type="number"
                                id="price-from"
                                placeholder="0"
                                min="0"
                                value={priceFrom}
                                onChange={(event) =>
                                    setPriceFrom(event.target.value)
                                }
                            />

                        </div>

                        <div className="price-field">

                            <label htmlFor="price-to">
                                До
                            </label>

                            <input
                                className="form-control"
                                type="number"
                                id="price-to"
                                placeholder="10000"
                                min="0"
                                value={priceTo}
                                onChange={(event) =>
                                    setPriceTo(event.target.value)
                                }
                            />

                        </div>

                    </div>

                </div>

            </div>

        </aside>
    );
}

// Главный компонент приложения
function App() {

    // Текущая страница
    const [currentPage, setCurrentPage] =
        useState(getPageFromHash);

    // ID выбранного товара
    const [selectedProductId, setSelectedProductId] =
        useState(getProductIdFromHash);

    // Поиск
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Фильтры
    const [selectedCategory, setSelectedCategory] =
        useState('Все товары');

    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');

    // Корзина
    const [cart, setCart] = useState(loadCart);

    // Сообщение о добавлении товара
    const [cartMessage, setCartMessage] = useState('');

    // Сохранение корзины
    useEffect(() => {
        try {
            localStorage.setItem(
                CART_STORAGE_KEY,
                JSON.stringify(cart)
            );
        } catch (error) {
            console.error('Ошибка сохранения корзины:', error);
        }
    }, [cart]);

    // Отслеживание переходов между страницами
    useEffect(() => {

        function handleHashChange() {
            setCurrentPage(getPageFromHash());
            setSelectedProductId(getProductIdFromHash());
        }

        window.addEventListener(
            'hashchange',
            handleHashChange
        );

        return () => {
            window.removeEventListener(
                'hashchange',
                handleHashChange
            );
        };

    }, []);

    // Поиск товаров
    function handleSearch() {
        setSearchQuery(searchInput.trim().toLowerCase());
    }

    // Добавление товара в корзину
    function handleAddToCart(product, quantity = 1) {

        if (
            !Number.isSafeInteger(quantity) ||
            quantity < 1
        ) {
            return;
        }

        setCart((previousCart) => {

            const existingProduct = previousCart.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {

                return previousCart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + quantity
                        }
                        : item
                );
            }

            return [
                ...previousCart,
                {
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                }
            ];
        });

        setCartMessage(
            `Товар «${product.name}» добавлен в корзину.`
        );
    }

    // Изменение количества товаров
    function handleUpdateQuantity(productId, quantity) {

        const validQuantity = Number.isFinite(quantity)
            ? Math.max(1, Math.floor(quantity))
            : 1;

        setCart((previousCart) =>
            previousCart.map((item) =>
                item.id === productId
                    ? {
                        ...item,
                        quantity: validQuantity
                    }
                    : item
            )
        );
    }

    // Удаление товара
    function handleRemove(productId) {

        setCart((previousCart) =>
            previousCart.filter(
                (item) => item.id !== productId
            )
        );
    }

    // Завершение заказа
    function handleOrderComplete() {

        setCart([]);
        setCartMessage('');

        try {
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch (error) {
            console.error('Ошибка очистки корзины:', error);
        }
    }

    // Количество товаров в корзине
    const cartCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    // Поиск и фильтрация товаров
    const filteredProducts = products.filter((product) => {

        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery);

        const matchesCategory =
            selectedCategory === 'Все товары' ||
            product.category === selectedCategory;

        const minPrice =
            priceFrom === '' ? 0 : Number(priceFrom);

        const maxPrice =
            priceTo === '' ? Infinity : Number(priceTo);

        return (
            matchesSearch &&
            matchesCategory &&
            product.price >= minPrice &&
            product.price <= maxPrice
        );
    });

    // Выбранный товар
    const selectedProduct = products.find(
        (product) => product.id === selectedProductId
    );

    // Переход к оформлению заказа
    function handleCheckout() {
        window.location.hash = '#checkout';
        setCurrentPage('checkout');
    }

    return (
        <>
            <Header
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearch={handleSearch}
                cartCount={cartCount}
            />

            {/* Каталог */}
            {currentPage === 'catalog' && (

                <main className="main container">

                    <h1 className="mb-4">
                        Каталог товаров
                    </h1>

                    {cartMessage && (

                        <div
                            className="alert alert-success"
                            role="status"
                        >
                            {cartMessage}
                        </div>

                    )}

                    <div className="row g-4">

                        <Filters
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            priceFrom={priceFrom}
                            setPriceFrom={setPriceFrom}
                            priceTo={priceTo}
                            setPriceTo={setPriceTo}
                        />

                        <section className="products col-12 col-md-8 col-lg-9">

                            <h2>Товары</h2>

                            <div
                                className="row g-4"
                                id="product-list"
                            >

                                {filteredProducts.length > 0 ? (

                                    filteredProducts.map((product) => (

                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={handleAddToCart}
                                        />

                                    ))

                                ) : (

                                    <div className="col-12">
                                        <p>Товары не найдены.</p>
                                    </div>

                                )}

                            </div>

                        </section>

                    </div>

                </main>

            )}

            {/* Страница отдельного товара */}
            {currentPage === 'product' && (

                <Product
                    key={selectedProductId ?? 'unknown'}
                    product={selectedProduct}
                    onAddToCart={handleAddToCart}
                />

            )}

            {/* Корзина */}
            {currentPage === 'cart' && (

                <Cart
                    cart={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemove}
                    onCheckout={handleCheckout}
                />

            )}

            {/* Оформление заказа */}
            {currentPage === 'checkout' && (

                <Checkout
                    cart={cart}
                    onOrderComplete={handleOrderComplete}
                />

            )}

            {/* Вход */}
            {currentPage === 'login' && (
                <Login />
            )}

            {/* Регистрация */}
            {currentPage === 'register' && (
                <Register />
            )}

            {/* Поддержка */}
            {currentPage === 'support' && (
                <Support />
            )}

            {/* Личный кабинет */}
            {currentPage === 'account' && (
                <Account />
            )}

        </>
    );
}

export default App;
