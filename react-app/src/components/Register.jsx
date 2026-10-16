
import { useState } from 'react';

// Проверка имени
function validateName(value) {
    const name = value.trim();

    if (name === '') {
        return 'Введите имя.';
    }

    const namePattern =
        /^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/;

    const lettersOnly = name.replace(
        /[^A-Za-zА-Яа-яЁё]/g,
        ''
    );

    if (!namePattern.test(name) || lettersOnly.length < 2) {
        return 'Имя должно содержать минимум 2 буквы.';
    }

    return '';
}

// Проверка электронной почты
function validateEmail(value) {
    const email = value.trim();

    if (email === '') {
        return 'Введите электронную почту.';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return 'Введите корректный E-mail.';
    }

    return '';
}

// Проверка пароля
function validatePassword(password) {
    if (password === '') {
        return 'Введите пароль.';
    }

    if (password.length < 6) {
        return 'Пароль должен содержать минимум 6 символов.';
    }

    return '';
}

// Проверка подтверждения пароля
function validatePasswordRepeat(password, passwordRepeat) {
    if (passwordRepeat === '') {
        return 'Повторите пароль.';
    }

    if (password !== passwordRepeat) {
        return 'Пароли не совпадают.';
    }

    return '';
}

function Register() {

    // Данные формы
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordRepeat: ''
    });

    // Ошибки полей
    const [errors, setErrors] = useState({});

    // Общее сообщение
    const [registerMessage, setRegisterMessage] = useState('');

    // Успешность проверки
    const [registerSuccess, setRegisterSuccess] = useState(false);

    // Проверка одного поля
    function validateField(fieldName, data) {
        switch (fieldName) {
            case 'name':
                return validateName(data.name);

            case 'email':
                return validateEmail(data.email);

            case 'password':
                return validatePassword(data.password);

            case 'passwordRepeat':
                return validatePasswordRepeat(
                    data.password,
                    data.passwordRepeat
                );

            default:
                return '';
        }
    }

    // Изменение значения поля
    function handleChange(event) {
        const { name, value } = event.target;

        const updatedData = {
            ...formData,
            [name]: value
        };

        setFormData(updatedData);

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: ''
        }));

        // При изменении пароля повторно проверяем подтверждение
        if (name === 'password' && updatedData.passwordRepeat !== '') {
            setErrors((previousErrors) => ({
                ...previousErrors,
                password: '',
                passwordRepeat: validatePasswordRepeat(
                    updatedData.password,
                    updatedData.passwordRepeat
                )
            }));
        }

        setRegisterMessage('');
        setRegisterSuccess(false);
    }

    // Проверка после выхода из поля
    function handleBlur(event) {
        const { name } = event.target;

        const error = validateField(name, formData);

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: error
        }));

        if (name === 'password' && formData.passwordRepeat !== '') {
            setErrors((previousErrors) => ({
                ...previousErrors,
                password: error,
                passwordRepeat: validatePasswordRepeat(
                    formData.password,
                    formData.passwordRepeat
                )
            }));
        }
    }

    // Отправка формы
    function handleSubmit(event) {
        event.preventDefault();

        const newErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            passwordRepeat: validatePasswordRepeat(
                formData.password,
                formData.passwordRepeat
            )
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(
            (error) => error !== ''
        );

        if (hasErrors) {
            setRegisterMessage(
                'Исправьте ошибки в форме регистрации.'
            );
            setRegisterSuccess(false);
            return;
        }

        // Пока это демонстрационная регистрация
        setRegisterMessage(
            'Все данные заполнены корректно! ' +
            'Настоящая регистрация будет доступна ' +
            'после подключения сервера.'
        );

        setRegisterSuccess(true);

        console.log(
            'Форма регистрации успешно прошла проверку.'
        );
    }

    return (
        <main className="main container">

            <div className="auth-container">

                <section className="auth-card shadow-sm">

                    <h1>Регистрация</h1>

                    <form
                        className="auth-form"
                        id="register-form"
                        noValidate
                        onSubmit={handleSubmit}
                    >

                        {/* Имя */}
                        <div className="form-group">

                            <label htmlFor="register-name">
                                Имя:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.name ? 'is-invalid' : ''
                                }`}
                                type="text"
                                id="register-name"
                                name="name"
                                placeholder="Имя"
                                autoComplete="given-name"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.name}
                            </div>

                        </div>

                        {/* E-mail */}
                        <div className="form-group">

                            <label htmlFor="register-email">
                                E-mail:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.email ? 'is-invalid' : ''
                                }`}
                                type="email"
                                id="register-email"
                                name="email"
                                placeholder="E-mail"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.email}
                            </div>

                        </div>

                        {/* Пароль */}
                        <div className="form-group">

                            <label htmlFor="register-password">
                                Пароль:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.password ? 'is-invalid' : ''
                                }`}
                                type="password"
                                id="register-password"
                                name="password"
                                placeholder="Пароль"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.password}
                            </div>

                        </div>

                        {/* Подтверждение пароля */}
                        <div className="form-group">

                            <label htmlFor="register-password-repeat">
                                Повторите пароль:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.passwordRepeat ? 'is-invalid' : ''
                                }`}
                                type="password"
                                id="register-password-repeat"
                                name="passwordRepeat"
                                placeholder="Повторите пароль"
                                autoComplete="new-password"
                                value={formData.passwordRepeat}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.passwordRepeat}
                            </div>

                        </div>

                        {/* Сообщение о результате */}
                        <div
                            id="register-message"
                            className={`mb-3 ${
                                registerSuccess
                                    ? 'text-success'
                                    : 'text-danger'
                            }`}
                            role="status"
                            aria-live="polite"
                        >
                            {registerMessage}
                        </div>

                        <button
                            className="auth-button btn btn-dark"
                            type="submit"
                        >
                            Зарегистрироваться
                        </button>

                    </form>

                    <p className="auth-link">
                        Уже есть аккаунт?{' '}
                        <a href="#login">
                            Войти
                        </a>
                    </p>

                </section>

            </div>

        </main>
    );
}

export default Register;
