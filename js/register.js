
// Функция отображения ошибки
function showError(inputId, message) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    error.textContent = message;
}

// Функция удаления ошибки
function clearError(inputId) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");

    input.classList.remove("is-invalid");

    error.textContent = "";
}

// Проверка имени
function validateName() {

    const name = document.getElementById("name").value.trim();

    if (name === "") {
        showError("name", "Введите имя.");
        return false;
    }

    const namePattern = /^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/;

    const lettersOnly = name.replace(/[^A-Za-zА-Яа-яЁё]/g, "");

    if (!namePattern.test(name) || lettersOnly.length < 2) {
        showError(
            "name",
            "Имя должно содержать минимум 2 буквы."
        );
        return false;
    }

    clearError("name");
    return true;
}

// Проверка электронной почты
function validateEmail() {

    const email = document.getElementById("email").value.trim();

    if (email === "") {
        showError("email", "Введите электронную почту.");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        showError("email", "Введите корректный E-mail.");
        return false;
    }

    clearError("email");
    return true;
}

// Проверка пароля: минимум 6 символов
function validatePassword() {

    const password = document.getElementById("password").value;

    if (password === "") {
        showError("password", "Введите пароль.");
        return false;
    }

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

// Проверка подтверждения пароля
function validatePasswordRepeat() {

    const password = document.getElementById("password").value;

    const passwordRepeat = document.getElementById(
        "password-repeat"
    ).value;

    if (passwordRepeat === "") {
        showError(
            "password-repeat",
            "Повторите пароль."
        );
        return false;
    }

    if (password !== passwordRepeat) {
        showError(
            "password-repeat",
            "Пароли не совпадают."
        );
        return false;
    }

    clearError("password-repeat");
    return true;
}

// Запуск после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {

    console.log("JavaScript регистрации подключен!");

    const registerForm = document.getElementById("register-form");
    const registerMessage = document.getElementById("register-message");

    // Проверка имени
    document.getElementById("name").addEventListener(
        "blur",
        validateName
    );

    // Проверка E-mail
    document.getElementById("email").addEventListener(
        "blur",
        validateEmail
    );

    // Проверка пароля
    document.getElementById("password").addEventListener(
        "blur",
        function () {

            validatePassword();

            if (document.getElementById("password-repeat").value !== "") {
                validatePasswordRepeat();
            }
        }
    );

    // Проверка повторного пароля
    document.getElementById("password-repeat").addEventListener(
        "blur",
        validatePasswordRepeat
    );

    // Отправка формы
    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        registerMessage.textContent = "";
        registerMessage.className = "mb-3";

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isPasswordRepeatValid = validatePasswordRepeat();

        const isFormValid =
            isNameValid &&
            isEmailValid &&
            isPasswordValid &&
            isPasswordRepeatValid;

        if (!isFormValid) {

            registerMessage.textContent =
                "Исправьте ошибки в форме регистрации.";

            registerMessage.classList.add("text-danger");

            return;
        }

        registerMessage.textContent =
            "Все данные заполнены корректно! " +
            "Настоящая регистрация будет доступна " +
            "после подключения сервера.";

        registerMessage.classList.add("text-success");

        console.log("Форма регистрации успешно прошла проверку.");
    });

});
