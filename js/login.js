
// Функция отображения ошибки
function showError(inputId, message) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");

    // Добавляем красную рамку Bootstrap
    input.classList.add("is-invalid");

    // Показываем текст ошибки
    error.textContent = message;
}

// Функция удаления ошибки
function clearError(inputId) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");

    input.classList.remove("is-invalid");

    error.textContent = "";
}

// Проверка электронной почты
function validateEmail() {

    const email = document.getElementById("email").value.trim();

    // Проверка на пустое поле
    if (email === "") {

        showError("email", "Введите электронную почту.");
        return false;
    }

    // Проверка формата E-mail
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        showError("email", "Введите корректный E-mail.");
        return false;
    }

    clearError("email");
    return true;
}

// Проверка пароля
function validatePassword() {

    const password = document.getElementById("password").value;

    // Проверка на пустое поле
    if (password === "") {

        showError("password", "Введите пароль.");
        return false;
    }

    // Проверка длины пароля
    if (password.length < 6) {

        showError(
            "password",
            "Пароль должен содержать минимум 6 символов."
        );

        return false;
    }

    clearError("password");
    return true;
}

// Выполняем код после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {

    console.log("JavaScript формы входа подключен!");

    const loginForm = document.getElementById("login-form");
    const loginMessage = document.getElementById("login-message");

    // Проверка E-mail после выхода из поля
    document.getElementById("email").addEventListener(
        "blur",
        validateEmail
    );

    // Проверка пароля после выхода из поля
    document.getElementById("password").addEventListener(
        "blur",
        validatePassword
    );

    // Обработка нажатия кнопки "Войти"
    loginForm.addEventListener("submit", function (event) {

        // Предотвращаем перезагрузку страницы
        event.preventDefault();

        // Очищаем предыдущее сообщение
        loginMessage.textContent = "";
        loginMessage.className = "mb-3";

        // Проверяем оба поля
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        // Если хотя бы одно поле заполнено неправильно
        if (!isEmailValid || !isPasswordValid) {

            loginMessage.textContent =
                "Исправьте ошибки в форме.";

            loginMessage.classList.add("text-danger");

            return;
        }

        // Если оба поля заполнены правильно
        loginMessage.textContent =
            "Данные заполнены корректно. " +
            "Настоящий вход будет доступен после подключения сервера.";

        loginMessage.classList.add("text-success");

        console.log("Проверка формы входа пройдена.");
    });

});
