const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./controllers/userRoutes');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public', 'frontend')));

app.use(express.json());
app.use('/api', userRouter);
app.get("/", (req, res) => {
    res.send('Перейдите по ссылке справа http://localhost:3000/main');
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'main_page.html'));
});

app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'registration_page.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'login_page.html'));
});

app.get('/developers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend', 'developers.html'));
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/main`);
});