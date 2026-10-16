
import { useState } from 'react';

// Проверка имени
function validateName(value) {
    const name = value.trim();

    if (name === '') {
        return 'Введите ваше имя.';
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

// Проверка темы обращения
function validateSubject(value) {
    const subject = value.trim();

    if (subject === '') {
        return 'Введите тему обращения.';
    }

    if (subject.length < 3) {
        return 'Тема обращения должна содержать минимум 3 символа.';
    }

    return '';
}

// Проверка сообщения
function validateMessage(value) {
    const message = value.trim();

    if (message === '') {
        return 'Введите текст сообщения.';
    }

    if (message.length < 10) {
        return 'Сообщение должно содержать минимум 10 символов.';
    }

    return '';
}

// Общая проверка отдельного поля
function validateField(fieldName, value) {
    switch (fieldName) {
        case 'name':
            return validateName(value);

        case 'email':
            return validateEmail(value);

        case 'subject':
            return validateSubject(value);

        case 'message':
            return validateMessage(value);

        default:
            return '';
    }
}

function Support() {

    // Состояние формы
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Состояние ошибок
    const [errors, setErrors] = useState({});

    // Сообщение о результате
    const [supportResult, setSupportResult] = useState('');

    // Успешность проверки
    const [supportSuccess, setSupportSuccess] = useState(false);

    // Изменение полей формы
    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: ''
        }));

        setSupportResult('');
        setSupportSuccess(false);
    }

    // Проверка после выхода из поля
    function handleBlur(event) {
        const { name, value } = event.target;

        const error = validateField(name, value);

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: error
        }));
    }

    // Отправка формы
    function handleSubmit(event) {
        event.preventDefault();

        const newErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            subject: validateSubject(formData.subject),
            message: validateMessage(formData.message)
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(
            (error) => error !== ''
        );

        if (hasErrors) {
            setSupportResult(
                'Исправьте ошибки в форме обращения.'
            );

            setSupportSuccess(false);
            return;
        }

        // Демонстрационное подтверждение
        setSupportResult(
            'Форма заполнена корректно! ' +
            'Отправка обращения будет доступна ' +
            'после подключения сервера.'
        );

        setSupportSuccess(true);

        console.log('Проверка формы поддержки пройдена.');
    }

    return (
        <main className="main container">

            <h1 className="mb-4">
                Поддержка
            </h1>

            <div className="support-layout">

                {/* Форма обращения */}
                <section className="support-form-section shadow-sm">

                    <h2>Связаться с нами</h2>

                    <form
                        className="support-form"
                        id="support-form"
                        noValidate
                        onSubmit={handleSubmit}
                    >

                        {/* Имя */}
                        <div className="form-group">

                            <label htmlFor="support-name">
                                Имя:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.name ? 'is-invalid' : ''
                                }`}
                                type="text"
                                id="support-name"
                                name="name"
                                placeholder="Ваше имя"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.name}
                            </div>

                        </div>

                        {/* Электронная почта */}
                        <div className="form-group">

                            <label htmlFor="support-email">
                                E-mail:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.email ? 'is-invalid' : ''
                                }`}
                                type="email"
                                id="support-email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.email}
                            </div>

                        </div>

                        {/* Тема обращения */}
                        <div className="form-group">

                            <label htmlFor="support-subject">
                                Тема обращения:
                            </label>

                            <input
                                className={`form-control ${
                                    errors.subject ? 'is-invalid' : ''
                                }`}
                                type="text"
                                id="support-subject"
                                name="subject"
                                placeholder="Тема обращения"
                                value={formData.subject}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.subject}
                            </div>

                        </div>

                        {/* Сообщение */}
                        <div className="form-group">

                            <label htmlFor="support-message">
                                Сообщение:
                            </label>

                            <textarea
                                className={`form-control ${
                                    errors.message ? 'is-invalid' : ''
                                }`}
                                id="support-message"
                                name="message"
                                rows="6"
                                placeholder="Опишите вашу проблему"
                                value={formData.message}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                            />

                            <div className="invalid-feedback">
                                {errors.message}
                            </div>

                        </div>

                        {/* Результат проверки */}
                        <div
                            id="support-result"
                            className={`mb-3 ${
                                supportSuccess
                                    ? 'text-success'
                                    : 'text-danger'
                            }`}
                            role="status"
                            aria-live="polite"
                        >
                            {supportResult}
                        </div>

                        <button
                            className="support-button btn btn-dark"
                            type="submit"
                        >
                            Отправить
                        </button>

                    </form>

                </section>

                {/* Часто задаваемые вопросы */}
                <section className="faq-section shadow-sm">

                    <h2>Часто задаваемые вопросы</h2>

                    <article className="faq-item">

                        <h3>Как оформить заказ?</h3>

                        <p>
                            Добавьте нужный товар в корзину,
                            перейдите в корзину и нажмите
                            «Оформить заказ».
                        </p>

                    </article>

                    <article className="faq-item">

                        <h3>Как узнать статус заказа?</h3>

                        <p>
                            Информация о статусе заказа
                            отображается в личном кабинете.
                        </p>

                    </article>

                    <article className="faq-item">

                        <h3>Какие способы получения доступны?</h3>

                        <p>
                            При оформлении заказа можно выбрать
                            доставку или самовывоз.
                        </p>

                    </article>

                </section>

            </div>

        </main>
    );
}

export default Support;
