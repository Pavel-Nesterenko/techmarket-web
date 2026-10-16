
console.log("JavaScript TechMarket подключен!");

// Массив товаров интернет-магазина
const products = [
    {
        id: 1,
        name: "Смарт ТВ приставка",
        category: "TV Box",
        price: 4990,
        description: "4K Ultra HD, 8/128 ГБ, Android",
        image: "images/product1.jpeg"
    },
    {
        id: 2,
        name: "Смарт ТВ приставка Mini",
        category: "TV Stick",
        price: 2990,
        description: "Full HD, 2/16 ГБ, Android",
        image: "images/product2.jpeg"
    },
    {
        id: 3,
        name: "Цифровой ТВ ресивер",
        category: "TV ресивер",
        price: 1990,
        description: "DVB-T2, HDMI, USB",
        image: "images/product1.jpeg"
    }
];

// Ключ для хранения корзины в браузере
const CART_STORAGE_KEY = "techmarket_cart";

// Текущая выбранная категория
let selectedCategory = "Все товары";

// Текущий поисковый запрос
let searchQuery = "";

// Функция отображения товаров
function renderProducts(productsArray) {

    const productList = document.getElementById("product-list");

    // Очищаем предыдущие карточки
    productList.innerHTML = "";

    // Если подходящих товаров нет
    if (productsArray.length === 0) {
        productList.innerHTML = `
            <div class="col-12">
                <p>Товары не найдены.</p>
            </div>
        `;
        return;
    }

    // Перебираем массив товаров
    productsArray.forEach(function (product) {

        // Формируем адрес страницы конкретного товара
        const productUrl = `product.html?id=${product.id}`;

        const productCard = `
            <div class="col-12 col-lg-6">

                <article class="product-card card shadow-sm h-100">

                    <a href="${productUrl}">
                        <img
                            src="${product.image}"
                            class="card-img-top"
                            alt="${product.name}">
                    </a>

                    <div class="card-body">

                        <h3 class="card-title">
                            <a href="${productUrl}">
                                ${product.name}
                            </a>
                        </h3>

                        <p class="card-text">
                            ${product.description}
                        </p>

                        <p class="price">
                            <strong>
                                ${product.price.toLocaleString("ru-RU")} ₽
                            </strong>
                        </p>

                        <div class="d-flex flex-wrap gap-2">

                            <a
                                class="btn btn-dark"
                                href="${productUrl}">
                                Подробнее
                            </a>

                            <button
                                class="btn btn-outline-dark add-to-cart"
                                type="button"
                                data-id="${product.id}">
                                В корзину
                            </button>

                        </div>

                    </div>

                </article>

            </div>
        `;

        productList.insertAdjacentHTML("beforeend", productCard);
    });
}

// Функция поиска и фильтрации товаров
function filterProducts() {

    const priceFromInput = document.getElementById("price-from");
    const priceToInput = document.getElementById("price-to");

    const priceFrom = priceFromInput.value === ""
        ? 0
        : Number(priceFromInput.value);

    const priceTo = priceToInput.value === ""
        ? Infinity
        : Number(priceToInput.value);

    const filteredProducts = products.filter(function (product) {

        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery);

        const matchesCategory =
            selectedCategory === "Все товары" ||
            product.category === selectedCategory;

        const matchesPrice =
            product.price >= priceFrom &&
            product.price <= priceTo;

        return matchesSearch && matchesCategory && matchesPrice;
    });

    renderProducts(filteredProducts);

    console.log("Найдено товаров:", filteredProducts.length);
}

// Получение корзины из localStorage
function getCart() {

    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Ошибка чтения корзины:", error);
        return [];
    }
}

// Добавление товара в корзину
function addToCart(productId) {

    // Находим выбранный товар в массиве
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    // Получаем текущую корзину
    const cart = getCart();

    // Проверяем, есть ли товар в корзине
    const existingProduct = cart.find(function (item) {
        return item.id === productId;
    });

    if (existingProduct) {

        // Если товар уже есть, увеличиваем количество
        existingProduct.quantity += 1;

    } else {

        // Если товара нет, добавляем его
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    // Сохраняем корзину в localStorage
    try {
        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

        alert("Товар добавлен в корзину!");

        console.log("Текущая корзина:", cart);
    } catch (error) {
        console.error("Ошибка сохранения корзины:", error);
        alert("Не удалось сохранить товар в корзину.");
    }
}

// Запуск после загрузки HTML
document.addEventListener("DOMContentLoaded", function () {

    console.log("Страница каталога полностью загружена!");
    console.log("Список товаров:", products);
    console.log("Количество товаров:", products.length);

    // Показываем все товары
    renderProducts(products);

    // ПОИСК ТОВАРОВ
    const searchForm = document.querySelector(".search");
    const searchInput = document.getElementById("search");

    searchForm.addEventListener("submit", function (event) {

        event.preventDefault();

        searchQuery = searchInput.value.trim().toLowerCase();

        filterProducts();
    });

    // ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ
    const categoryLinks = document.querySelectorAll(
        ".filter-group ul a"
    );

    categoryLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();

            selectedCategory = link.textContent.trim();

            console.log("Выбрана категория:", selectedCategory);

            filterProducts();
        });
    });

    // ФИЛЬТРАЦИЯ ПО ЦЕНЕ
    const priceFromInput = document.getElementById("price-from");
    const priceToInput = document.getElementById("price-to");

    priceFromInput.addEventListener("input", function () {
        filterProducts();
    });

    priceToInput.addEventListener("input", function () {
        filterProducts();
    });

    // ДОБАВЛЕНИЕ ТОВАРОВ В КОРЗИНУ
    const productList = document.getElementById("product-list");

    productList.addEventListener("click", function (event) {

        const addButton = event.target.closest(".add-to-cart");

        if (addButton) {

            const productId = Number(addButton.dataset.id);

            addToCart(productId);
        }
    });

});
