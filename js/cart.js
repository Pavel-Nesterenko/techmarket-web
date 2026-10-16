
// Ключ для хранения корзины в браузере
const CART_STORAGE_KEY = "techmarket_cart";

// Получаем сохранённую корзину
function getCart() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Ошибка загрузки корзины:", error);
        return [];
    }
}

// Сохраняем корзину
function saveCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// Форматирование цены
function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " ₽";
}

// Отображение корзины
function renderCart() {

    const cart = getCart();
    const cartList = document.getElementById("cart-items-list");

    cartList.innerHTML = "";

    // Если корзина пуста
    if (cart.length === 0) {
        cartList.innerHTML = "<p>Корзина пуста.</p>";
    }

    let subtotal = 0;

    // Создаём карточки товаров
    cart.forEach(function (product) {

        subtotal += product.price * product.quantity;

        const cartItem = `
            <article class="cart-item shadow-sm">

                <img src="${product.image}" alt="${product.name}">

                <div class="cart-item-info">

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <h3>${product.name}</h3>

                    <p>
                        Цена:
                        <strong>${formatPrice(product.price)}</strong>
                    </p>

                    <div class="cart-actions">

                        <label for="quantity-${product.id}">
                            Количество:
                        </label>

                        <input
                            class="form-control cart-quantity"
                            type="number"
                            id="quantity-${product.id}"
                            data-id="${product.id}"
                            value="${product.quantity}"
                            min="1">

                        <button
                            class="btn btn-outline-danger remove-item"
                            type="button"
                            data-id="${product.id}">
                            Удалить
                        </button>

                    </div>

                </div>

            </article>
        `;

        cartList.insertAdjacentHTML("beforeend", cartItem);
    });

    // Рассчитываем стоимость доставки
    let delivery = 0;

    if (subtotal > 0 && subtotal < 8000) {
        delivery = 500;
    }

    const total = subtotal + delivery;

    // Обновляем итоговую стоимость
    document.getElementById("cart-subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("cart-delivery").textContent =
        delivery === 0 ? "Бесплатно" : formatPrice(delivery);

    document.getElementById("cart-total").textContent =
        formatPrice(total);

    // Запрещаем оформление пустой корзины
    const checkoutButton = document.getElementById("checkout-button");

    if (cart.length === 0) {
        checkoutButton.classList.add("disabled");
        checkoutButton.setAttribute("aria-disabled", "true");
        checkoutButton.setAttribute("tabindex", "-1");
    } else {
        checkoutButton.classList.remove("disabled");
        checkoutButton.removeAttribute("aria-disabled");
        checkoutButton.removeAttribute("tabindex");
    }
}

// Изменение количества товара
function updateQuantity(productId, quantity) {

    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (!product) {
        return;
    }

    product.quantity = Math.max(1, Math.floor(quantity));

    saveCart(cart);
    renderCart();
}

// Удаление товара
function removeFromCart(productId) {

    const cart = getCart();

    const updatedCart = cart.filter(function (product) {
        return product.id !== productId;
    });

    saveCart(updatedCart);
    renderCart();
}

// Запуск после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {

    renderCart();

    const cartList = document.getElementById("cart-items-list");

    // Обработка изменения количества
    cartList.addEventListener("change", function (event) {

        if (event.target.classList.contains("cart-quantity")) {

            const productId = Number(event.target.dataset.id);
            const quantity = Number(event.target.value);

            if (!Number.isFinite(quantity) || quantity < 1) {
                event.target.value = 1;
                updateQuantity(productId, 1);
                return;
            }

            updateQuantity(productId, quantity);
        }
    });

    // Обработка удаления товара
    cartList.addEventListener("click", function (event) {

        const removeButton = event.target.closest(".remove-item");

        if (removeButton) {
            const productId = Number(removeButton.dataset.id);
            removeFromCart(productId);
        }
    });

});
