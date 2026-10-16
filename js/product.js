
// Данные товаров
// ID, названия, цены и изображения соответствуют каталогу

const products = [
    {
        id: 1,
        name: "Смарт ТВ приставка",
        category: "TV Box",
        price: 4990,
        description: "4K Ultra HD, 8/128 ГБ, Android",
        image: "images/product1.jpeg",
        fullDescription:
            "Смарт ТВ приставка предназначена для просмотра " +
            "мультимедийного контента и использования приложений " +
            "на телевизоре.",
        specifications: {
            "Операционная система": "Android TV 15",
            "Процессор": "Cortex A53",
            "Оперативная память": "8 ГБ",
            "Встроенная память": "128 ГБ",
            "Разрешение": "4K Ultra HD"
        }
    },

    {
        id: 2,
        name: "Смарт ТВ приставка Mini",
        category: "TV Stick",
        price: 2990,
        description: "Full HD, 2/16 ГБ, Android",
        image: "images/product2.jpeg",
        fullDescription:
            "Компактная смарт ТВ приставка Mini позволяет " +
            "смотреть видео и пользоваться приложениями " +
            "на телевизоре. Поддерживает разрешение Full HD.",
        specifications: {
            "Операционная система": "Android",
            "Тип устройства": "TV Stick",
            "Оперативная память": "2 ГБ",
            "Встроенная память": "16 ГБ",
            "Разрешение": "Full HD"
        }
    },

    {
        id: 3,
        name: "Цифровой ТВ ресивер",
        category: "TV ресивер",
        price: 1990,
        description: "DVB-T2, HDMI, USB",
        image: "images/product1.jpeg",
        fullDescription:
            "Цифровой ТВ ресивер предназначен для приёма " +
            "цифрового эфирного телевидения DVB-T2. " +
            "Оснащён разъёмами HDMI и USB.",
        specifications: {
            "Стандарт телевидения": "DVB-T2",
            "Подключение": "HDMI",
            "USB": "Есть",
            "Тип устройства": "Цифровой ТВ ресивер"
        }
    }
];

// Получаем ID товара из адресной строки
const urlParams = new URLSearchParams(window.location.search);

const productId = Number(urlParams.get("id") || 1);

// Находим товар в массиве
const selectedProduct = products.find(function (product) {
    return product.id === productId;
});

// Форматирование цены
function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " ₽";
}

// Отображение информации о товаре
function renderProduct(product) {

    document.title = product.name + " — TechMarket";

    document.getElementById("product-image").src = product.image;
    document.getElementById("product-image").alt = product.name;

    document.getElementById("product-category").textContent =
        product.category;

    document.getElementById("product-name").textContent =
        product.name;

    document.getElementById("product-code").textContent =
        "Артикул: TM-" + String(product.id).padStart(3, "0");

    document.getElementById("product-price").textContent =
        formatPrice(product.price);

    document.getElementById("product-description").textContent =
        product.fullDescription;

    // Заполняем таблицу характеристик
    const specificationsBody = document.getElementById(
        "product-specifications"
    );

    specificationsBody.innerHTML = "";

    Object.entries(product.specifications).forEach(function (entry) {

        const characteristic = entry[0];
        const value = entry[1];

        const row = document.createElement("tr");

        const heading = document.createElement("th");
        heading.scope = "row";
        heading.textContent = characteristic;

        const cell = document.createElement("td");
        cell.textContent = value;

        row.appendChild(heading);
        row.appendChild(cell);

        specificationsBody.appendChild(row);
    });
}

// Добавление выбранного товара в корзину
function addProductToCart(product, quantity) {

    const cart = JSON.parse(
        localStorage.getItem("techmarket_cart") || "[]"
    );

    // Проверяем, есть ли такой товар в корзине
    const existingProduct = cart.find(function (item) {
        return item.id === product.id;
    });

    if (existingProduct) {

        // Увеличиваем количество
        existingProduct.quantity += quantity;

    } else {

        // Добавляем новый товар
        cart.push({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }

    // Сохраняем общую корзину
    localStorage.setItem(
        "techmarket_cart",
        JSON.stringify(cart)
    );
}

// Запуск после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {

    // Если товар не найден
    if (!selectedProduct) {

        document.getElementById("product-page").classList.add("d-none");

        document.getElementById("product-error").classList.remove("d-none");

        return;
    }

    // Показываем выбранный товар
    renderProduct(selectedProduct);

    const cartForm = document.getElementById("product-cart-form");

    const quantityInput = document.getElementById("quantity");

    const productMessage = document.getElementById("product-message");

    // Обработка добавления в корзину
    cartForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const quantity = Number(quantityInput.value);

        // Проверяем количество
        if (!Number.isSafeInteger(quantity) || quantity < 1) {

            productMessage.textContent =
                "Введите корректное количество товара.";

            productMessage.className = "mt-3 text-danger";

            return;
        }

        // Добавляем товар
        addProductToCart(selectedProduct, quantity);

        // Показываем сообщение
        productMessage.textContent =
            "Товар добавлен в корзину!";

        productMessage.className = "mt-3 text-success";

        // Ссылка для перехода в корзину
        const cartLink = document.createElement("a");

        cartLink.href = "cart.html";
        cartLink.textContent = " Перейти в корзину";

        productMessage.appendChild(cartLink);

        console.log(
            "Добавлен товар:",
            selectedProduct.name,
            "Количество:",
            quantity
        );
    });
});
