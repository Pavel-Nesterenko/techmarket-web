
import { useState } from 'react';

function Account() {

    // Демонстрационные данные пользователя
    const [user, setUser] = useState({
        name: 'Иван Иванов',
        email: 'email@gmail.com'
    });

    // Режим редактирования
    const [isEditing, setIsEditing] = useState(false);

    // Поля формы
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email
    });

    // Ошибки формы
    const [errors, setErrors] = useState({});

    // Сообщение об успешном сохранении
    const [message, setMessage] = useState('');

    // Открытие формы редактирования
    function handleEdit() {

        setFormData({
            name: user.name,
            email: user.email
        });

        setErrors({});
        setMessage('');
        setIsEditing(true);
    }

    // Изменение полей
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
    }

    // Сохранение изменений
    function handleSave(event) {

        event.preventDefault();

        const newErrors = {};

        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();

        // Проверка имени
        if (trimmedName.length < 2) {
            newErrors.name =
                'Имя должно содержать минимум 2 символа.';
        }

        // Проверка электронной почты
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(trimmedEmail)) {
            newErrors.email =
                'Введите корректный адрес электронной почты.';
        }

        setErrors(newErrors);

        // Если есть ошибки — не сохраняем
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        // Обновляем данные пользователя
        setUser({
            name: trimmedName,
            email: trimmedEmail
        });

        setIsEditing(false);

        setMessage('Личные данные успешно обновлены!');
    }

    // Отмена редактирования
    function handleCancel() {

        setIsEditing(false);
        setErrors({});
        setMessage('');
    }

    return (
        <main className="main container">

            <h1 className="mb-4">
                Личный кабинет
            </h1>

            <div className="account-layout">

                {/* Личные данные */}
                <section className="account-data shadow-sm">

                    <h2>Личные данные</h2>

                    {message && (

                        <div
                            className="alert alert-success"
                            role="status"
                        >
                            {message}
                        </div>

                    )}

                    {!isEditing ? (

                        <>
                            <p>
                                <strong>Имя:</strong>{' '}
                                {user.name}
                            </p>

                            <p>
                                <strong>E-mail:</strong>{' '}
                                {user.email}
                            </p>

                            <button
                                className="account-button btn btn-dark"
                                type="button"
                                onClick={handleEdit}
                            >
                                Редактировать данные
                            </button>

                            <p className="logout-link">
                                <a href="#login">
                                    Выйти
                                </a>
                            </p>
                        </>

                    ) : (

                        <form onSubmit={handleSave} noValidate>

                            <div className="mb-3">

                                <label
                                    className="form-label"
                                    htmlFor="account-name"
                                >
                                    Имя
                                </label>

                                <input
                                    className={`form-control ${
                                        errors.name ? 'is-invalid' : ''
                                    }`}
                                    type="text"
                                    id="account-name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                                {errors.name && (
                                    <div className="invalid-feedback">
                                        {errors.name}
                                    </div>
                                )}

                            </div>

                            <div className="mb-3">

                                <label
                                    className="form-label"
                                    htmlFor="account-email"
                                >
                                    E-mail
                                </label>

                                <input
                                    className={`form-control ${
                                        errors.email ? 'is-invalid' : ''
                                    }`}
                                    type="email"
                                    id="account-email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                                {errors.email && (
                                    <div className="invalid-feedback">
                                        {errors.email}
                                    </div>
                                )}

                            </div>

                            <div className="d-flex flex-wrap gap-2">

                                <button
                                    className="btn btn-dark"
                                    type="submit"
                                >
                                    Сохранить
                                </button>

                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={handleCancel}
                                >
                                    Отмена
                                </button>

                            </div>

                        </form>

                    )}

                </section>

                {/* История заказов */}
                <section className="order-history shadow-sm">

                    <h2>История заказов</h2>

                    <article className="order-card">

                        <h3>Заказ №01</h3>

                        <p>
                            <strong>Дата:</strong>{' '}
                            08.09.2026
                        </p>

                        <p>
                            <strong>Статус:</strong>{' '}
                            <span className="badge text-bg-success">
                                Выполнен
                            </span>
                        </p>

                        <h4>Состав заказа</h4>

                        <ul className="list-group mb-3">

                            <li className="list-group-item">
                                Смарт ТВ приставка × 1
                            </li>

                        </ul>

                        <p>
                            <strong>Сумма заказа:</strong>{' '}
                            4 990 ₽
                        </p>

                    </article>

                </section>

            </div>

        </main>
    );
}

export default Account;
