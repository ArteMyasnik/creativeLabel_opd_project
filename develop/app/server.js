const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const userRouter = require('./controllers/userRoutes');
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

app.get('/respondents', async (req, res) => {
    try {
        const query = 'SELECT users.login\nFROM users\nLEFT OUTER JOIN test_visual_signal ON test_visual_signal.user_id = users.id\nLEFT OUTER JOIN test_color_signal ON test_color_signal.user_id = users.id\nLEFT OUTER JOIN test_digital_signal ON test_digital_signal.user_id = users.id\nLEFT OUTER JOIN test_simple_rdo ON test_simple_rdo.user_id = users.id\nLEFT OUTER JOIN test_complex_rdo ON test_complex_rdo.user_id = users.id\nWHERE test_visual_signal.user_id IS NOT NULL\nOR test_color_signal.user_id IS NOT NULL\nOR test_digital_signal.user_id IS NOT NULL\nOR test_simple_rdo.user_id IS NOT NULL\nOR test_complex_rdo.user_id IS NOT NULL'
        const result = await pool.query(query);
        const respondents = result.rows;
        res.render('respondents', { respondents: respondents });
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/stats', async (req, res) => {
    const login = req.session.login || null;
    res.render('stats', { login });
});

app.get('/experts', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        const experts = await pool.query('SELECT * FROM users WHERE isExpert = true');
        const expertCount = experts.rows.length;
        res.render('experts', { users: users.rows, expertCount });
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
        const result_pvk = await pool.query('SELECT * FROM pvks');
        const pvks = result_pvk.rows;
        const result_profession = await pool.query('SELECT * FROM professions');
        const professions = result_profession.rows;
        res.render('professions_rating', { pvks: pvks, professions: professions, isAdmin: !!req.session.isAdmin, login: req.session.login || null, isExpert: !!req.session.isExpert });
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.get('/results', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT pp.profession_id, pp.pvk_id, p.name AS profession_name, pvk.pvk AS pvk_name
            FROM profession_pvk pp
            JOIN professions p ON pp.profession_id = p.id
            JOIN pvks pvk ON pp.pvk_id = pvk.id
        `);

        async function calculateStats(professionId, pvkId) {
            try {
                // Получаем все оценки для данной профессии и оцениваемого пвк
                const resultMarks = await pool.query(`
                    SELECT mark
                    FROM profession_pvk
                    WHERE profession_id = $1
                    AND pvk_id = $2;
                `, [professionId, pvkId]);

                // Извлекаем оценки
                const marks = resultMarks.rows.map(row => row.mark);

                // Кол-во экспертов, оценивших эту профессию
                const expertCountResult = await pool.query(`
                    SELECT expert_count
                    FROM professions
                    WHERE id = $1
                `, [professionId]);

                const expertCount = expertCountResult.rows[0].expert_count;

                // Вычисляем среднее арифметическое
                const mean = marks.reduce((sum, mark) => sum + mark, 0) / expertCount;

                // Вычисляем дисперсию
                const variance = marks.reduce((sum, mark) => sum + Math.abs(mark - mean), 0) / expertCount;

                return {variance, mean};
            } catch (err) {
                console.error('Ошибка при расчете статистики:', err);
                return 0;
            }
        }

        // Создаем массивы для хранения промисов (ожиданий высчитывания оценок)
        const gradesByIdPromises = {};
        const gradesPromises = {};

        // Сначала собираем все промисы (собираем все возможные расчёты)
        result.rows.forEach(row => {
            if (!gradesByIdPromises[row.profession_id]) {
                gradesByIdPromises[row.profession_id] = {};
            }
            gradesByIdPromises[row.profession_id][row.pvk_id] = calculateStats(row.profession_id, row.pvk_id);

            if (!gradesPromises[row.profession_name]) {
                gradesPromises[row.profession_name] = {};
            }
            gradesPromises[row.profession_name][row.pvk_name] = calculateStats(row.profession_id, row.pvk_id);
        });

        // Дожидаемся выполнения всех промисов и готово
        const gradesById = {};
        for (const professionId in gradesByIdPromises) {
            gradesById[professionId] = {};
            for (const pvkId in gradesByIdPromises[professionId]) {
                gradesById[professionId][pvkId] = await gradesByIdPromises[professionId][pvkId];
            }
        }

        const grades = {};
        for (const professionName in gradesPromises) {
            grades[professionName] = {};
            
            // Заполняем оценки
            for (const pvkName in gradesPromises[professionName]) {
                grades[professionName][pvkName] = await gradesPromises[professionName][pvkName];
            }
            
            // Преобразуем в массив пар [key, value] для сортировки
            const entries = Object.entries(grades[professionName]);
        
            // Сортируем: сначала по variance (по возрастанию), затем по mean (по убыванию)
            entries.sort((a, b) => {
                const aValue = a[1];
                const bValue = b[1];
                
                // Сначала сравниваем variance
                if (aValue.variance !== bValue.variance) {
                    return aValue.variance - bValue.variance; // по возрастанию
                }
                // Если variance равны, сравниваем mean
                return bValue.mean - aValue.mean; // по убыванию
            });

        
            // Восстанавливаем объект из отсортированного массива
            const sortedObject = {};
            for (const [key, value] of entries) {
                sortedObject[key] = value.mean;
            }
            
            // Заменяем исходный объект на отсортированный
            grades[professionName] = sortedObject;
        }
        
        const professionsResult = await pool.query('SELECT * FROM professions ORDER BY id');

        res.render('results', {
            grades: grades,
            professions: professionsResult.rows,
        });
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Views EJS tests ------------------------------------------------------------------------
app.get('/test_visual_signal', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_visual_signal', { login });
});
app.get('/test_sound', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_sound', { login });
});

app.get('/test_color_signal', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_color_signal', { login });
});

app.get('/test_digital_signal', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_digital_signal', { login });
});

app.get('/test_simple_rdo', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_simple_rdo', { login });
});
app.get('/test_complex_rdo', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_complex_rdo', { login });
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Views EJS stats ------------------------------------------------------------------------
app.get('/stats_test_visual_signal/:login', async (req, res) => {
    const { login } = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query('SELECT id FROM users WHERE login = $1', [login]);

        if (user.rows.length === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT reaction_times, missed_signals
             FROM test_visual_signal
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render('tests/stats/stats_test_visual_signal', {
                login,
                noData: true
            });
        }

        // 3. Собираем все попытки в один массив
        let allAttempts = [];
        let totalMissed = 0;
        let attemptCounter = 1;

        result.rows.forEach(test => {
            test.reaction_times.forEach(time => {
                allAttempts.push({
                    attemptNumber: attemptCounter++,
                    time: time
                });
            });
            totalMissed += test.missed_signals;
        });

        // 4. Рассчитываем статистику
        const totalAttempts = allAttempts.length;
        const accurateAttempts = totalAttempts - totalMissed;
        const accuracy = (accurateAttempts / totalAttempts * 100).toFixed(1);
        const avgReaction = (allAttempts.reduce((sum, a) => sum + a.time, 0) / totalAttempts).toFixed(1);

        res.render('tests/stats/stats_test_visual_signal', {
            login,
            noData: false,
            stats: {
                totalAttempts,
                avgReaction,
                accuracy,
                bestReaction: Math.min(...allAttempts.map(a => a.time)),
                worstReaction: Math.max(...allAttempts.map(a => a.time))
            },
            chartData: {
                attempts: allAttempts.map(a => a.attemptNumber),
                reactionTimes: allAttempts.map(a => a.time)
            }
        });

    } catch (err) {
        console.error('Ошибка при получении статистики:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// app.get('/stats_test_color_signal/:login', async (req, res) => {
//     const { login } = req.params;
//     try {
//         // Получение данных пользователя из базы данных
//         const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
//
//         if (user.rows.length === 0) {
//             return res.status(404).send('Пользователь не найден');
//         }
//
//         const userId = user.rows[0].id;
//
//         res.render('tests/stats/stats_test_color_signal', { login });
//         // Передача данных в шаблон
//         res.render('profile', {
//             login: user.rows[0].login,
//             email: user.rows[0].email,
//             sex: user.rows[0].sex,
//             age: user.rows[0].age
//         });
//     } catch (err) {
//         console.error('Ошибка при получении данных пользователя:', err);
//         res.status(500).send('Ошибка сервера');
//     }
// });
//
// app.get('/stats_test_digital_signal/:login', async (req, res) => {
//     const { login } = req.params;
//     try {
//         // Получение данных пользователя из базы данных
//         const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
//
//         if (user.rows.length === 0) {
//             return res.status(404).send('Пользователь не найден');
//         }
//
//         const userId = user.rows[0].id;
//
//         res.render('tests/stats/stats_test_digital_signal', { login });
//         // Передача данных в шаблон
//         res.render('profile', {
//             login: user.rows[0].login,
//             email: user.rows[0].email,
//             sex: user.rows[0].sex,
//             age: user.rows[0].age
//         });
//     } catch (err) {
//         console.error('Ошибка при получении данных пользователя:', err);
//         res.status(500).send('Ошибка сервера');
//     }
// });
//
// app.get('/stats_test_simple_rdo/:login', async (req, res) => {
//     const { login } = req.params;
//     try {
//         // Получение данных пользователя из базы данных
//         const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
//
//         if (user.rows.length === 0) {
//             return res.status(404).send('Пользователь не найден');
//         }
//
//         const userId = user.rows[0].id;
//
//         res.render('tests/stats/stats_test_simple_rdo', { login });
//         // Передача данных в шаблон
//         res.render('profile', {
//             login: user.rows[0].login,
//             email: user.rows[0].email,
//             sex: user.rows[0].sex,
//             age: user.rows[0].age
//         });
//     } catch (err) {
//         console.error('Ошибка при получении данных пользователя:', err);
//         res.status(500).send('Ошибка сервера');
//     }
// });
// app.get('/stats_test_complex_rdo/:login', async (req, res) => {
//     const { login } = req.params;
//     try {
//         // Получение данных пользователя из базы данных
//         const user = await pool.query('SELECT * FROM users WHERE login = $1', [login]);
//
//         if (user.rows.length === 0) {
//             return res.status(404).send('Пользователь не найден');
//         }
//
//         const userId = user.rows[0].id;
//
//         res.render('tests/stats/stats_test_complex_rdo', { login });
//         // Передача данных в шаблон
//         res.render('profile', {
//             login: user.rows[0].login,
//             email: user.rows[0].email,
//             sex: user.rows[0].sex,
//             age: user.rows[0].age
//         });
//     } catch (err) {
//         console.error('Ошибка при получении данных пользователя:', err);
//         res.status(500).send('Ошибка сервера');
//     }
// });

// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/main`);
});
