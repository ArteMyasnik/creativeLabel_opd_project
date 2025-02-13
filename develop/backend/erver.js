const express = require('express');
const { Client } = require('pg'); // Клиент PostgreSQL
const app = express();
const port = 3000;

// Настройки для подключения к PostgreSQL
const client = new Client({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'iloveopd',
    database: process.env.DB_NAME || 'creativeLabelDB',
    port: process.env.DB_PORT || 5432,
});

// Подключение к базе данных
client.connect()
    .then(() => {
        console.log('Подключено к PostgreSQL');
    })
    .catch((err) => {
        console.error('Ошибка подключения к PostgreSQL:', err.stack);
    });

// Обслуживание статических файлов
app.use(express.static('../frontend'));

// Пример маршрута API
app.get('/data', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM your_table'); // Запрос к базе данных
        res.json(result.rows); // Отправляем результат клиенту
    } catch (err) {
        console.error('Ошибка запроса к базе данных:', err.stack);
        res.status(500).send('Ошибка базы данных');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});