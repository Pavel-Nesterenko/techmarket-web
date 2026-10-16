
// Отображение ошибки
function showError(inputId, message) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(inputId + "-error");

    input.classList.add("is-invalid");

    error.textContent = message;
}

// Удаление ошибки
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
        showError("name", "Введите ваше имя.");
        return false;
    }

    const namePattern = /^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/;

    const lettersOnly = name.replace(/[^A-Za-zА-Яа-яЁё]/g, "");

    if (!namePattern.test(name) || lettersOnly.length < 2) {
        showError("name", "Имя должно содержать минимум 2 буквы.");
        return false;
    }

    clearError("name");
    return true;
}

// Проверка E-mail
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

// Проверка темы обращения
function validateSubject() {

    const subject = document.getElementById("subject").value.trim();

    if (subject === "") {
        showError("subject", "Введите тему обращения.");
        return false;
    }

    if (subject.length < 3) {
        showError(
            "subject",
            "Тема обращения должна содержать минимум 3 символа."
        );
        return false;
    }

    clearError("subject");
    return true;
}

// Проверка сообщения
function validateMessage() {

    const message = document.getElementById("message").value.trim();

    if (message === "") {
        showError("message", "Введите текст сообщения.");
        return false;
    }

    if (message.length < 10) {
        showError(
            "message",
            "Сообщение должно содержать минимум 10 символов."
        );
        return false;
    }

    clearError("message");
    return true;
}

// Запуск после загрузки страницы
document.addEventListener("DOMContentLoaded", function () {

    console.log("JavaScript формы поддержки подключен!");

    const supportForm = document.getElementById("support-form");
    const supportResult = document.getElementById("support-result");

    // Проверка полей после выхода из них
    document.getElementById("name").addEventListener(
        "blur",
        validateName
    );

    document.getElementById("email").addEventListener(
        "blur",
        validateEmail
    );

    document.getElementById("subject").addEventListener(
        "blur",
        validateSubject
    );

    document.getElementById("message").addEventListener(
        "blur",
        validateMessage
    );

    // Обработка отправки формы
    supportForm.addEventListener("submit", function (event) {

        // Не перезагружаем страницу
        event.preventDefault();

        supportResult.textContent = "";
        supportResult.className = "mb-3";

        // Проверяем все поля
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();

        const isFormValid =
            isNameValid &&
            isEmailValid &&
            isSubjectValid &&
            isMessageValid;

        // Если есть ошибки
        if (!isFormValid) {

            supportResult.textContent =
                "Исправьте ошибки в форме обращения.";

            supportResult.classList.add("text-danger");

            return;
        }

        // Демонстрационное подтверждение
        supportResult.textContent =
            "Форма заполнена корректно! " +
            "Отправка обращения будет доступна " +
            "после подключения сервера.";

        supportResult.classList.add("text-success");

        console.log("Проверка формы поддержки пройдена.");

        // Настоящая отправка пока не выполняется
    });

});
