const express = require('express');
const path = require('path');
const app = express();
const userRouter = require('./controllers/userRoutes');
const actionRouter = require('./controllers/backend/actionRoutes');
const PORT = process.env.PORT || 3000;
const pool = require('./db/db');

app.use(express.static(path.join(__dirname, 'public', 'frontend')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', userRouter);

app.set('view engine', 'ejs'); // Устанавливаем шаблонизатор
app.set('views', path.join(__dirname, 'public', 'frontend', 'views')); // Указываем папку с шаблонами

app.get("/", (req, res) => {
    res.send('Перейдите по ссылке справа http://localhost:3000/main');
});
// Main ------------------------------------------------------------------------------------
// app.get('/main', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public/frontend/Pages', 'main_page.html'));
// });

app.get('/main', (req, res) => {
    const login = req.user ? res.user.login : null; // Логин пользователя
    console.log(login)
    res.render('main_page', { login });
});
// -----------------------------------------------------------------------------------------
// Registration and login ------------------------------------------------------------------
app.get('/registration', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/auth', 'registration_page.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/auth', 'login_page.html'));
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
// Profile changes -------------------------------------------------------------------------
app.put('/profile/:login/update-info', (req, res) => {
    const { login } = req.params;
    const { age, sex } = req.body;
    res.status(200).json({ message: 'Возраст и пол обновлены успешно!' });
});

app.put('/profile/:login/update-password', (req, res) => {
    const { login } = req.params;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    res.status(200).json({ message: 'Пароль обновлен успешно!' });
});

app.put('/profile/:login/update-login', (req, res) => {
    const { login } = req.params;
    const { oldLogin, newLogin } = req.body;
    res.status(200).json({ message: 'Логин обновлен успешно!' });
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Pages HTML professions ------------------------------------------------------------------
app.get('/businessCompScientist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'businessCompScientist.html'));
});

app.get('/computerScientist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'computerScientist.html'));
});

app.get('/developer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'developer.html'));
});

app.get('/gameDeveloper', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'gameDeveloper.html'));
});

app.get('/itSpecialist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'itSpecialist.html'));
});

app.get('/operator', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'operator.html'));
});

app.get('/programmer', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'programmer.html'));
});

app.get('/sysAdmin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'sysAdmin.html'));
});
app.get('/tester', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/professions', 'tester.html'));
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Pages HTML menu -------------------------------------------------------------------------
app.get('/aboutProject', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'aboutProject.html'));
});

app.get('/goals', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'goals.html'));
});

// app.get('/profile/:login', (req, res) => {
//     const { login } = req.params;
//     res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'profile.html'));
// });

app.get('/profile/:login', async (req, res) => {
    const { login } = req.params;

    try {
        // Получение данных пользователя из базы данных
        const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);

        if (user.rows.length === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        // Передача данных в шаблон
        res.render('profile', {
            login: user.rows[0].login,
            email: user.rows[0].email,
            sex: user.rows[0].sex,
            age: user.rows[0].age
        });
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/developers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'developers.html'));
});

app.get('/pvk', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'pvk.html'));
});

app.get('/experts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'experts.html'));
});

app.get('/professions_rating', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'professions_rating.html'));
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'results.html'));
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/main`);
});
