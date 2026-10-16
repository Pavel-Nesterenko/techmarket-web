
// Ключ корзины должен совпадать с catalog.js и cart.js
const CART_STORAGE_KEY = "techmarket_cart";

// Получаем товары из localStorage
function getCart() {
    try {
        const savedCart = localStorage.getItem(CART_STORAGE_KEY);
        const cart = savedCart ? JSON.parse(savedCart) : [];

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Ошибка чтения корзины:", error);
        return [];
    }
}

// Форматируем цену
function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " ₽";
}

// Рассчитываем сумму товаров
function calculateSubtotal(cart) {
    return cart.reduce(function (sum, product) {
        return sum + product.price * product.quantity;
    }, 0);
}

// Рассчитываем доставку
function calculateDelivery(subtotal, method) {
    if (subtotal === 0 || method === "pickup") {
        return 0;
    }

    return subtotal >= 8000 ? 0 : 500;
}

// Показываем товары и стоимость заказа
function renderOrder() {

    const cart = getCart();
    const orderItems = document.getElementById("order-items");

    const deliveryMethod = document.querySelector(
        'input[name="delivery-method"]:checked'
    ).value;

    orderItems.innerHTML = "";

    if (cart.length === 0) {

        orderItems.innerHTML = `
            <li class="list-group-item">
                Корзина пуста.
            </li>
        `;

    } else {

        cart.forEach(function (product) {

            const itemTotal = product.price * product.quantity;

            const item = document.createElement("li");
            item.className = "list-group-item";

            item.textContent =
                product.name +
                " × " +
                product.quantity +
                " — " +
                formatPrice(itemTotal);

            orderItems.appendChild(item);
        });
    }

    const subtotal = calculateSubtotal(cart);
    const delivery = calculateDelivery(subtotal, deliveryMethod);
    const total = subtotal + delivery;

    document.getElementById("order-subtotal").textContent =
        formatPrice(subtotal);

    document.getElementById("order-delivery").textContent =
        delivery === 0 ? "Бесплатно" : formatPrice(delivery);

    document.getElementById("order-total").textContent =
        formatPrice(total);

    // Если корзина пуста, заказ оформить нельзя
    document.getElementById("submit-order").disabled =
        cart.length === 0;
}

// Показываем ошибку под полем
function showError(inputId, message) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    error.textContent = message;
}

// Убираем ошибку
function clearError(inputId) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");

    input.classList.remove("is-invalid");

    error.textContent = "";
}

// Проверка имени
function validateName() {

    const name = document.getElementById("name").value.trim();

    if (name.length === 0) {
        showError("name", "Введите имя.");
        return false;
    }

    // Не менее двух букв, допускаются пробелы и дефисы
    const namePattern = /^[A-Za-zА-Яа-яЁё\s-]{2,}$/;

    if (!namePattern.test(name)) {
        showError("name", "Имя должно содержать минимум 2 буквы.");
        return false;
    }

    clearError("name");
    return true;
}

// Проверка телефона
function validatePhone() {

    const phone = document.getElementById("phone").value.trim();

    const digits = phone.replace(/\D/g, "");

    if (digits.length < 10 || digits.length > 15) {
        showError(
            "phone",
            "Введите корректный телефон: от 10 до 15 цифр."
        );
        return false;
    }

    clearError("phone");
    return true;
}

// Проверка электронной почты
function validateEmail() {

    const email = document.getElementById("email").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showError("email", "Введите корректный E-mail.");
        return false;
    }

    clearError("email");
    return true;
}

// Проверка адреса доставки
function validateAddress() {

    const method = document.querySelector(
        'input[name="delivery-method"]:checked'
    ).value;

    // При самовывозе адрес не нужен
    if (method === "pickup") {
        clearError("address");
        return true;
    }

    const address = document.getElementById("address").value.trim();

    if (address.length < 5) {
        showError(
            "address",
            "Введите адрес доставки (минимум 5 символов)."
        );
        return false;
    }

    clearError("address");
    return true;
}

// Показываем или скрываем поле адреса
function updateAddressVisibility() {

    const method = document.querySelector(
        'input[name="delivery-method"]:checked'
    ).value;

    const addressGroup = document.getElementById("address-group");
    const addressInput = document.getElementById("address");

    if (method === "pickup") {

        addressGroup.style.display = "none";
        addressInput.required = false;
        clearError("address");

    } else {

        addressGroup.style.display = "";
        addressInput.required = true;
    }
}

// Запуск после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("checkout-form");
    const orderMessage = document.getElementById("order-message");

    // Отображаем текущий заказ
    renderOrder();
    updateAddressVisibility();

    // Проверяем поля при выходе из них
    document.getElementById("name").addEventListener(
        "blur",
        validateName
    );

    document.getElementById("phone").addEventListener(
        "blur",
        validatePhone
    );

    document.getElementById("email").addEventListener(
        "blur",
        validateEmail
    );

    document.getElementById("address").addEventListener(
        "blur",
        validateAddress
    );

    // Обработка выбора доставки или самовывоза
    document.querySelectorAll(
        'input[name="delivery-method"]'
    ).forEach(function (radio) {

        radio.addEventListener("change", function () {
            updateAddressVisibility();
            renderOrder();
        });
    });

    // Отправка формы
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        orderMessage.textContent = "";
        orderMessage.className = "mt-3";

        // Выполняем все проверки
        const isNameValid = validateName();
        const isPhoneValid = validatePhone();
        const isEmailValid = validateEmail();
        const isAddressValid = validateAddress();

        const isFormValid =
            isNameValid &&
            isPhoneValid &&
            isEmailValid &&
            isAddressValid;

        if (!isFormValid) {

            orderMessage.textContent =
                "Исправьте ошибки в форме.";

            orderMessage.classList.add("text-danger");

            return;
        }

        // Проверяем, что корзина не пуста
        const cart = getCart();

        if (cart.length === 0) {

            orderMessage.textContent =
                "Невозможно оформить заказ: корзина пуста.";

            orderMessage.classList.add("text-danger");

            return;
        }

        // Демонстрационное оформление заказа
        orderMessage.textContent =
            "Заказ успешно оформлен! Это демонстрационный заказ.";

        orderMessage.classList.add("text-success");

        console.log("Демонстрационный заказ:", {
            name: document.getElementById("name").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            email: document.getElementById("email").value.trim(),
            deliveryMethod: document.querySelector(
                'input[name="delivery-method"]:checked'
            ).value,
            address: document.getElementById("address").value.trim(),
            products: cart
        });

        // Очищаем корзину после успешного оформления
        localStorage.removeItem(CART_STORAGE_KEY);

        // Обновляем список товаров и сумму
        renderOrder();

        // Очищаем форму
        form.reset();
        updateAddressVisibility();
    });

});
