const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const userRouter = require('./controllers/userRoutes');
const actionRouter = require('./controllers/backend/actionRoutes');
const PORT = process.env.PORT || 3000;
const pool = require('./db/db');
const crypto = require('crypto');

const secretKey = crypto.randomBytes(64).toString('hex');

app.use(session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

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
app.get('/main', async (req, res) => {
    try {
        const login = req.session.login || null;
        const isAdmin = req.session.isAdmin || false;
        const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
        if (user.rows.length === 0) {
            const isExpert = false;
            console.log(login, isAdmin, isExpert);
            res.render('main_page', {login, isAdmin, isExpert});
        } else {
            const isExpert = user.rows[0].isexpert;
            console.log(login, isAdmin, isExpert);
            res.render('main_page', {login, isAdmin, isExpert});
        }
    } catch (err) {
        console.error('Ошибка при получении данных пользователя:', err);
        res.status(500).send('Ошибка сервера');
    }
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

app.get('/check-auth', (req, res) => {
    res.json({
        isAdmin: !!req.session.isAdmin,
        login: req.session.login || null,
        isExpert: !!req.session.isExpert
    });
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Ошибка при выходе:', err);
            return res.status(500).json({ message: 'Ошибка сервера' });
        }
        const checkMessage = "Выход из системы";
        console.log(checkMessage);
        res.status(200).json({ message: 'Выход выполнен успешно!' });
    });
});
// -----------------------------------------------------------------------------------------
// Profile changes -------------------------------------------------------------------------
app.put('/profile/:login/update-sex', (req, res) => {
    const { login } = req.params;
    const { sex } = req.body;
    res.status(200).json({ message: 'Пол обновлены успешно!' });
});

app.put('/profile/:login/update-age', (req, res) => {
    const { login } = req.params;
    const { age } = req.body;
    res.status(200).json({ message: 'Возрасты обновлены успешно!' });
});

app.put('/profile/:login/update-password', (req, res) => {
    const { login } = req.params;
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    res.status(200).json({ message: 'Пароль обновлен успешно!' });
});

// app.put('/profile/:login/update-email', (req, res) => {
//     const { login } = req.params;
//     const { email } = req.body;
//     res.status(200).json({ message: 'Логин обновлен успешно!' });
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

app.get('/tests', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'tests.html'));
});

app.get('/developers', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'developers.html'));
});

app.get('/pvk', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pvks');
        const pvks = result.rows;
        res.render('pvk', { pvks: pvks });
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/experts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        const users = result.rows;
        res.render('experts', { users: users });
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.put('/experts', (req, res) => {
    const { login } = req.body;
    res.status(200).json({ message: 'Логин обновлен успешно!' });
});

app.get('/professions_rating', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM pvks');
        const pvks = result.rows;
        res.render('professions_rating', { pvks: pvks, isAdmin: !!req.session.isAdmin, login: req.session.login || null, isExpert: !!req.session.isExpert });
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/results', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/frontend/Pages/menu', 'results.html'));
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Pages HTML tests ------------------------------------------------------------------------
app.get('/test_visual_signal', (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_visual_signal', { login });
});

app.get('/test_color_signal', (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_color_signal', { login });
});

app.get('/test_digital_signal', (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_digital_signal', { login });
});

app.get('/test_simple_rdo', (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_simple_rdo', { login });
});
app.get('/test_complex_rdo', (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_complex_rdo', { login });
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/main`);
});
