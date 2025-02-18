const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./controllers/userRoutes');
const actionRouter = require('./controllers/backend/actionRoutes');
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public', 'frontend')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.post('/registration', (req, res) => {
    const { login, email, password } = req.body;
    console.log('Данные регистрации:', { login, email, password });
    res.status(200).json({ message: 'Регистрация прошла успешно!' });
});

app.post('/login', (req, res) => {
    const { login, password } = req.body;
    console.log('Данные входа:', { login, password });
    res.status(200).json({ message: 'Вход выполнен успешно!' });
});


// -----------------------------------------------------------------------------------------
// Pages HTML ------------------------------------------------------------------------------
app.get('/businessCompScientist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'businessCompScientist.html'));
});

app.get('/computerScientist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'computerScientist.html'));
});

app.get('/developer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'developer.html'));
});

app.get('/developers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'developers.html'));
});

app.get('/gameDeveloper', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'gameDeveloper.html'));
});

app.get('/goals', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'goals.html'));
});

app.get('/itSpecialist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'itSpecialist.html'));
});

app.get('/operator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'operator.html'));
});
app.get('/programmer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'programmer.html'));
});

app.get('/sysAdmin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'sysAdmin.html'));
});

app.get('/tester', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'tester.html'));
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/main`);
});