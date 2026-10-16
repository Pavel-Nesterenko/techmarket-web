
import { useState } from 'react';

function Login() {

    // Состояние полей формы
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    // Состояние ошибок
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });

    // Сообщение о результате проверки
    const [loginMessage, setLoginMessage] = useState('');

    // Успешность проверки
    const [loginSuccess, setLoginSuccess] = useState(false);

    // Проверка электронной почты
    function validateEmail(email) {

        const trimmedEmail = email.trim();

        if (trimmedEmail === '') {
            return 'Введите электронную почту.';
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail)) {
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

    // Обработка изменения полей
    function handleChange(event) {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        // Убираем ошибку изменённого поля
        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: ''
        }));

        setLoginMessage('');
        setLoginSuccess(false);
    }

    // Проверка после выхода из поля
    function handleBlur(event) {

        const { name, value } = event.target;

        let error = '';

        if (name === 'email') {
            error = validateEmail(value);
        }

        if (name === 'password') {
            error = validatePassword(value);
        }

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: error
        }));
    }

    // Обработка отправки формы
    function handleSubmit(event) {

        event.preventDefault();

        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);

        setErrors({
            email: emailError,
            password: passwordError
        });

        // Если есть ошибки
        if (emailError || passwordError) {

            setLoginMessage('Исправьте ошибки в форме.');
            setLoginSuccess(false);

            return;
        }

        // Демонстрационный вход
        setLoginMessage(
            'Данные заполнены корректно. ' +
            'Настоящий вход будет доступен после подключения сервера.'
        );

        setLoginSuccess(true);

        console.log('Проверка формы входа пройдена.');
    }

    return (
        <main className="main container">

            <div className="auth-container">

                <section className="auth-card shadow-sm">

                    <h1>Вход</h1>

                    <form
                        className="auth-form"
                        id="login-form"
                        noValidate
                        onSubmit={handleSubmit}
                    >

                        {/* Электронная почта */}
                        <div className="form-group">

                            <label htmlFor="email">
                                E-mail:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.email ? 'is-invalid' : ''
                                }`}
                                type="email"
                                id="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div
                                className="invalid-feedback"
                                id="email-error"
                            >
                                {errors.email}
                            </div>

                        </div>

                        {/* Пароль */}
                        <div className="form-group">

                            <label htmlFor="password">
                                Пароль:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.password ? 'is-invalid' : ''
                                }`}
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Пароль"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div
                                className="invalid-feedback"
                                id="password-error"
                            >
                                {errors.password}
                            </div>

                        </div>

                        {/* Сообщение о результате */}
                        <div
                            id="login-message"
                            className={`mb-3 ${
                                loginSuccess
                                    ? 'text-success'
                                    : 'text-danger'
                            }`}
                            role="status"
                            aria-live="polite"
                        >
                            {loginMessage}
                        </div>

                        <button
                            className="auth-button btn btn-dark"
                            type="submit"
                        >
                            Войти
                        </button>

                    </form>

                    <p className="auth-link">
                        Нет аккаунта?{' '}
                        <a href="#register">
                            Зарегистрироваться
                        </a>
                    </p>

                    <p className="auth-link">
                        <a href="#account">
                            Перейти в личный кабинет
                        </a>
                    </p>

                </section>

            </div>

        </main>
    );
}

export default Login;
