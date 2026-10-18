
import { useState } from 'react';

const API_URL = 'http://localhost:3001';

function validateName(value) {
    const name = value.trim();

    if (name === '') {
        return 'Введите ваше имя.';
    }

    const namePattern =
        /^[A-Za-zА-Яа-яЁё]+(?:[ -][A-Za-zА-Яа-яЁё]+)*$/;

    const lettersOnly = name.replace(/[^A-Za-zА-Яа-яЁё]/g, '');

    if (!namePattern.test(name) || lettersOnly.length < 2) {
        return 'Имя должно содержать минимум 2 буквы.';
    }

    return '';
}

function validateEmail(value) {
    const email = value.trim();

    if (email === '') {
        return 'Введите электронную почту.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return 'Введите корректный E-mail.';
    }

    return '';
}

function validateSubject(value) {
    const subject = value.trim();

    if (subject === '') {
        return 'Введите тему обращения.';
    }

    if (subject.length < 3 || subject.length > 200) {
        return 'Тема обращения должна содержать от 3 до 200 символов.';
    }

    return '';
}

function validateMessage(value) {
    const message = value.trim();

    if (message === '') {
        return 'Введите текст сообщения.';
    }

    if (message.length < 10 || message.length > 5000) {
        return 'Сообщение должно содержать от 10 до 5000 символов.';
    }

    return '';
}

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
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [supportResult, setSupportResult] = useState('');
    const [supportSuccess, setSupportSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    function handleBlur(event) {
        const { name, value } = event.target;

        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: validateField(name, value)
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setSupportResult('');
        setSupportSuccess(false);

        const newErrors = {
            name: validateName(formData.name),
            email: validateEmail(formData.email),
            subject: validateSubject(formData.subject),
            message: validateMessage(formData.message)
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== '')) {
            setSupportResult('Исправьте ошибки в форме обращения.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/support`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    subject: formData.subject.trim(),
                    message: formData.message.trim()
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || 'Не удалось отправить обращение.'
                );
            }

            setSupportResult(
                `Обращение №${result.requestId} успешно отправлено!`
            );
            setSupportSuccess(true);

            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

            setErrors({});
        } catch (error) {
            setSupportResult(
                error instanceof TypeError
                    ? 'Не удалось подключиться к серверу. Проверьте, запущен ли Node.js.'
                    : error.message
            );
            setSupportSuccess(false);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="main container">
            <h1 className="mb-4">Поддержка</h1>

            <div className="support-layout">
                <section className="support-form-section shadow-sm">
                    <h2>Связаться с нами</h2>

                    <form
                        className="support-form"
                        id="support-form"
                        noValidate
                        onSubmit={handleSubmit}
                    >
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
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Отправляем...' : 'Отправить'}
                        </button>
                    </form>
                </section>

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
