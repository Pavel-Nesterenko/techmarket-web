
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// Стили интернет-магазина TechMarket
import './style.css';

// Главный компонент приложения
import App from './App.jsx';

// Запуск React-приложения
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>
);
