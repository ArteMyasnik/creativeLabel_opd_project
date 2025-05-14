const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const userRouter = require("./controllers/userRoutes");
const PORT = process.env.PORT || 3000;
const pool = require("./db/db");
const crypto = require("crypto");

const secretKey = crypto.randomBytes(64).toString("hex");

app.use(
    session({
        secret: secretKey,
        resave: false,
        saveUninitialized: true,
        cookie: {secure: false},
    })
);

app.use(express.static(path.join(__dirname, "public", "frontend")));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/api", userRouter);

app.set("view engine", "ejs"); // Устанавливаем шаблонизатор
app.set("views", path.join(__dirname, "public", "frontend", "views")); // Указываем папку с шаблонами

app.get("/", (req, res) => {
    res.send("Перейдите по ссылке справа http://localhost:3000/main");
});
// Main ------------------------------------------------------------------------------------
app.get("/main", async (req, res) => {
    try {
        const login = req.session.login || null;
        const isAdmin = req.session.isAdmin || false;
        const user = await pool.query("SELECT * FROM users WHERE login = $1", [
            login,
        ]);
        if (user.rows.length === 0) {
            const isExpert = false;
            console.log(login, isAdmin, isExpert);
            res.render("main_page", {login, isAdmin, isExpert});
        } else {
            const isExpert = user.rows[0].isexpert;
            console.log(login, isAdmin, isExpert);
            res.render("main_page", {login, isAdmin, isExpert});
        }
    } catch (err) {
        console.error("Ошибка при получении данных пользователя:", err);
        res.status(500).send("Ошибка сервера");
    }
});
// -----------------------------------------------------------------------------------------
// Registration and login ------------------------------------------------------------------
app.get("/registration", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/auth", "registration_page.html")
    );
});

app.get("/login", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/auth", "login_page.html")
    );
});

app.post("/registration", (req, res) => {
    const {login, email, password} = req.body;
    console.log("Данные регистрации:", {login, email, password});
    res.status(200).json({message: "Регистрация прошла успешно!"});
});

app.post("/login", (req, res) => {
    const {login, password} = req.body;
    console.log("Данные входа:", {login, password});
    res.status(200).json({message: "Вход выполнен успешно!"});
});

app.get("/check-auth", (req, res) => {
    res.json({
        isAdmin: !!req.session.isAdmin,
        login: req.session.login || null,
        isExpert: !!req.session.isExpert,
    });
});

app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Ошибка при выходе:", err);
            return res.status(500).json({message: "Ошибка сервера"});
        }
        res.status(200).json({message: "Выход выполнен успешно!"});
    });
});
// -----------------------------------------------------------------------------------------
// Profile changes -------------------------------------------------------------------------
app.put("/profile/:login/update-sex", (req, res) => {
    const {login} = req.params;
    const {sex} = req.body;
    res.status(200).json({message: "Пол обновлены успешно!"});
});

app.put("/profile/:login/update-age", (req, res) => {
    const {login} = req.params;
    const {age} = req.body;
    res.status(200).json({message: "Возрасты обновлены успешно!"});
});

app.put("/profile/:login/update-password", (req, res) => {
    const {login} = req.params;
    const {oldPassword, newPassword, confirmNewPassword} = req.body;
    res.status(200).json({message: "Пароль обновлен успешно!"});
});


app.get("/profile/:login", async (req, res) => {
    const {login} = req.params;

    try {
        // Получение данных пользователя из базы данных
        const user = await pool.query("SELECT * FROM users WHERE login = $1", [login]);


        if (user.rows.length === 0) {
            return res.status(404).send('Пользователь не найден');
        }

        // Получаем список пройденных тестов пользователя
        const userTestsResult = await pool.query('SELECT t.type as test_type FROM test_user tu INNER JOIN tests t ON tu.test_id = t.id WHERE tu.user_id = $1', [user.rows[0].id]);

        // Передача данных в шаблон
        res.render('profile', {
            login: user.rows[0].login,
            email: user.rows[0].email,
            sex: user.rows[0].sex,
            age: user.rows[0].age,
            userTests: userTestsResult.rows
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
app.get("/businessCompScientist", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public/frontend/Pages/professions",
            "businessCompScientist.html"
        )
    );
});

app.get("/computerScientist", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public/frontend/Pages/professions",
            "computerScientist.html"
        )
    );
});

app.get("/developer", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/professions", "developer.html")
    );
});

app.get("/gameDeveloper", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public/frontend/Pages/professions",
            "gameDeveloper.html"
        )
    );
});

app.get("/itSpecialist", (req, res) => {
    res.sendFile(
        path.join(
            __dirname,
            "public/frontend/Pages/professions",
            "itSpecialist.html"
        )
    );
});

app.get("/operator", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/professions", "operator.html")
    );
});

app.get("/programmer", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/professions", "programmer.html")
    );
});

app.get("/sysAdmin", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/professions", "sysAdmin.html")
    );
});
app.get("/tester", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/professions", "tester.html")
    );
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Pages HTML menu -------------------------------------------------------------------------
app.get("/aboutProject", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/menu", "aboutProject.html")
    );
});

app.get("/goals", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/menu", "goals.html")
    );
});

app.get("/tests", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/menu", "tests.html")
    );
});

app.get("/developers", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public/frontend/Pages/menu", "developers.html")
    );
});

app.get("/pvk", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM pvks");
        const pvks = result.rows;
        res.render("pvk", {pvks: pvks});
    } catch (err) {
        console.error("Ошибка при выполнении запроса:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/respondents", async (req, res) => {
    try {
        const query =
            "SELECT DISTINCT users.login\nFROM users\nLEFT OUTER JOIN test_visual_signal ON test_visual_signal.user_id = users.id\nLEFT OUTER JOIN test_color_signal ON test_color_signal.user_id = users.id\nLEFT OUTER JOIN test_digital_signal ON test_digital_signal.user_id = users.id\nLEFT OUTER JOIN test_simple_rdo ON test_simple_rdo.user_id = users.id\nLEFT OUTER JOIN test_complex_rdo ON test_complex_rdo.user_id = users.id\nWHERE test_visual_signal.user_id IS NOT NULL\nOR test_color_signal.user_id IS NOT NULL\nOR test_digital_signal.user_id IS NOT NULL\nOR test_simple_rdo.user_id IS NOT NULL\nOR test_complex_rdo.user_id IS NOT NULL";
        const result = await pool.query(query);
        const respondents = result.rows;
        res.render("respondents", {respondents: respondents});
    } catch (err) {
        console.error("Ошибка при выполнении запроса:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/stats", async (req, res) => {
    const login = req.session.login || null;
    res.render("stats", {login});
});

app.get("/experts", async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users");
        const experts = await pool.query(
            "SELECT * FROM users WHERE isExpert = true"
        );
        const expertCount = experts.rows.length;
        res.render("experts", {users: users.rows, expertCount});
    } catch (err) {
        console.error("Ошибка при выполнении запроса:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get('/prof_test_results', async (req, res) => {
    try {
        const result_tests = await pool.query('SELECT * FROM tests');
        const tests = result_tests.rows;
        const result_profession = await pool.query('SELECT * FROM professions');
        const professions = result_profession.rows;
        const result_profession_tests = await pool.query(`
            SELECT pt.user_id, pt.profession_id, pt.test_id, pt.mark, 
                   p.name as profession_name, t.test as test_name
            FROM profession_test pt
            JOIN professions p ON pt.profession_id = p.id
            JOIN tests t ON pt.test_id = t.id
        `);
        
        // Создаём трёхмерную структуру
        const usersProfessionsTests = {};
        
        result_profession_tests.rows.forEach(row => {
            const {  user_id, profession_id, test_id, mark, profession_name, test_name } = row;
            
            // Если нет записи для этого профессии - создаём
            if (!usersProfessionsTests[profession_id]) {
                usersProfessionsTests[profession_id] = {};
            }
            
            // Если нет записи для этого пользователя у этой профессии - создаём
            if (!usersProfessionsTests[profession_id][user_id]) {
                usersProfessionsTests[profession_id][user_id] = {
                    profession_name: profession_name,
                    tests: []
                };
            }
            
            // Добавляем тест
            usersProfessionsTests[profession_id][user_id].tests.push({
                test_id: test_id,
                test_name: test_name,
                mark: mark
            });
        });
        res.render('prof_test_results', { usersProfessionsTests: usersProfessionsTests, tests: tests, professions: professions, isAdmin: !!req.session.isAdmin, login: req.session.login || null, isExpert: !!req.session.isExpert });
        
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});
app.get('/professions_tests', async (req, res) => {
    try {
        const result_tests = await pool.query('SELECT * FROM tests');
        const tests = result_tests.rows;
        const result_profession = await pool.query('SELECT * FROM professions');
        const professions = result_profession.rows;
        const result_profession_tests = await pool.query(`
            SELECT pt.user_id, pt.profession_id, pt.test_id, pt.mark, 
                   p.name as profession_name, t.test as test_name
            FROM profession_test pt
            JOIN professions p ON pt.profession_id = p.id
            JOIN tests t ON pt.test_id = t.id
        `);
        
        
        res.render('professions_tests', {  tests: tests, professions: professions, isAdmin: !!req.session.isAdmin, login: req.session.login || null, isExpert: !!req.session.isExpert });
        
    } catch (err) {
        console.error('Ошибка при выполнении запроса:', err);
        res.status(500).send('Ошибка сервера');
    }
});

app.put("/experts", (req, res) => {
    const {login} = req.body;
    res.status(200).json({message: "Логин обновлен успешно!"});
});

app.get("/professions_rating", async (req, res) => {
    try {
        const result_pvk = await pool.query("SELECT * FROM pvks");
        const pvks = result_pvk.rows;
        const result_profession = await pool.query("SELECT * FROM professions");
        const professions = result_profession.rows;
        res.render("professions_rating", {
            pvks: pvks,
            professions: professions,
            isAdmin: !!req.session.isAdmin,
            login: req.session.login || null,
            isExpert: !!req.session.isExpert,
        });
    } catch (err) {
        console.error("Ошибка при выполнении запроса:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/results", async (req, res) => {
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
                const resultMarks = await pool.query(
                    `
                        SELECT mark
                        FROM profession_pvk
                        WHERE profession_id = $1
                          AND pvk_id = $2;
                    `,
                    [professionId, pvkId]
                );

                // Извлекаем оценки
                const marks = resultMarks.rows.map((row) => row.mark);

                // Кол-во экспертов, оценивших эту профессию
                const expertCountResult = await pool.query(
                    `
                        SELECT expert_count
                        FROM professions
                        WHERE id = $1
                    `,
                    [professionId]
                );

                const expertCount = expertCountResult.rows[0].expert_count;

                // Вычисляем среднее арифметическое
                const mean = marks.reduce((sum, mark) => sum + mark, 0) / expertCount;

                // Вычисляем дисперсию
                const variance =
                    marks.reduce((sum, mark) => sum + Math.abs(mark - mean), 0) /
                    expertCount;

                return {variance, mean};
            } catch (err) {
                console.error("Ошибка при расчете статистики:", err);
                return 0;
            }
        }

        // Создаем массивы для хранения промисов (ожиданий высчитывания оценок)
        const gradesByIdPromises = {};
        const gradesPromises = {};

        // Сначала собираем все промисы (собираем все возможные расчёты)
        result.rows.forEach((row) => {
            if (!gradesByIdPromises[row.profession_id]) {
                gradesByIdPromises[row.profession_id] = {};
            }
            gradesByIdPromises[row.profession_id][row.pvk_id] = calculateStats(
                row.profession_id,
                row.pvk_id
            );

            if (!gradesPromises[row.profession_name]) {
                gradesPromises[row.profession_name] = {};
            }
            gradesPromises[row.profession_name][row.pvk_name] = calculateStats(
                row.profession_id,
                row.pvk_id
            );
        });

        // Дожидаемся выполнения всех промисов и готово
        const gradesById = {};
        for (const professionId in gradesByIdPromises) {
            gradesById[professionId] = {};
            for (const pvkId in gradesByIdPromises[professionId]) {
                gradesById[professionId][pvkId] = await gradesByIdPromises[
                    professionId
                    ][pvkId];
            }
        }

        const grades = {};
        for (const professionName in gradesPromises) {
            grades[professionName] = {};

            // Заполняем оценки
            for (const pvkName in gradesPromises[professionName]) {
                grades[professionName][pvkName] = await gradesPromises[professionName][
                    pvkName
                    ];
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

        const professionsResult = await pool.query(
            "SELECT * FROM professions ORDER BY id"
        );

        res.render("results", {
            grades: grades,
            professions: professionsResult.rows,
        });
    } catch (err) {
        console.error("Ошибка при выполнении запроса:", err);
        res.status(500).send("Ошибка сервера");
    }
});

// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Views EJS tests ------------------------------------------------------------------------
app.get("/test_visual_signal", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_visual_signal", {login});
});

app.get("/test_sound_signal", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_sound_signal", {login});
});

app.get("/test_color_signal", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_color_signal", {login});
});

app.get("/test_digital_signal", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_digital_signal", {login});
});

app.get("/test_audio_sum", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_audio_sum", {login});
});

app.get("/test_simple_rdo", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_simple_rdo", {login});
});

app.get("/test_complex_rdo", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_complex_rdo", {login});
});

app.get("/test_complex_rdo_15", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/test_complex_rdo_15", {login});
});

app.get("/test_short_memory", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/extra_tests/test_short_memory", {login});
});

app.get("/test_visual_memory", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/extra_tests/test_visual_memory", {login});
});

app.get("/test_ariphmet", async (req, res) => {
  const login = req.session.login || null;
  res.render("tests/extra_tests/test_ariphmet", { login });
});

app.get("/test_chislovr", async (req, res) => {
  const login = req.session.login || null;
  res.render("tests/extra_tests/test_chislovr", { login });
});


app.get("/test_shulte", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/extra_tests/test_shulte", {login});
});

app.get("/test_strupe", async (req, res) => {
    const login = req.session.login || null;
    res.render("tests/extra_tests/test_strupe", {login});
});

app.get('/test_analog_tracking', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_analog_tracking', {login});
});

app.get('/test_analog_chase', async (req, res) => {
    const login = req.session.login || null;
    res.render('tests/test_analog_chase', {login});
});
// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

// -----------------------------------------------------------------------------------------
// Views EJS stats ------------------------------------------------------------------------
app.get("/stats_test_visual_signal/:login", async (req, res) => {
    const {login} = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query("SELECT id FROM users WHERE login = $1", [
            login,
        ]);

        if (user.rows.length === 0) {
            return res.status(404).send("Пользователь не найден");
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT id, reaction_times, created_at
             FROM test_visual_signal
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render("tests/stats/stats_test_visual_signal", {
                login,
                noData: true,
            });
        }

        // 3. Собираем данные по каждому тесту отдельно
        const testsData = result.rows.map((test, index) => {
            const reactions = test.reaction_times || [];
            return {
                testId: test.id,
                testNumber: index + 1,
                reactions: reactions,
                createdAt: test.created_at,
                avgReaction:
                    reactions.length > 0
                        ? (
                            reactions.reduce((sum, a) => sum + a, 0) / reactions.length
                        ).toFixed(1)
                        : 0,
                bestReaction: reactions.length > 0 ? Math.min(...reactions) : 0,
                worstReaction: reactions.length > 0 ? Math.max(...reactions) : 0,
                totalReactions: reactions.length,
            };
        });

        // 4. Рассчитываем общую статистику по всем тестам
        const allReactions = testsData.flatMap((test) => test.reactions);
        const totalAttempts = allReactions.length;
        const avgReaction =
            totalAttempts > 0
                ? (allReactions.reduce((sum, a) => sum + a, 0) / totalAttempts).toFixed(
                    1
                )
                : 0;

        res.render("tests/stats/stats_test_visual_signal", {
            login,
            noData: false,
            stats: {
                totalTests: testsData.length,
                totalAttempts,
                avgReaction,
                bestReaction: totalAttempts > 0 ? Math.min(...allReactions) : 0,
                worstReaction: totalAttempts > 0 ? Math.max(...allReactions) : 0,
            },
            testsData, // передаем данные по каждому тесту отдельно
            chartData: {
                // данные для графика (можно выбрать какой тест отображать)
                testNumbers: testsData.map((test) => test.testNumber),
                avgReactions: testsData.map((test) => test.avgReaction),
            },
        });
    } catch (err) {
        console.error("Ошибка при получении статистики:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/stats_test_sound_signal/:login", async (req, res) => {
    const {login} = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query("SELECT id FROM users WHERE login = $1", [
            login,
        ]);

        if (user.rows.length === 0) {
            return res.status(404).send("Пользователь не найден");
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT id, reaction_times, missed_signals, test_duration, created_at
             FROM test_sound_signal
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render("tests/stats/stats_test_sound_signal", {
                login,
                noData: true,
            });
        }

        // 3. Собираем данные по каждому тесту отдельно
        const testsData = result.rows.map((test, index) => {
            const reactions = test.reaction_times || [];
            const totalSignals = reactions.length + test.missed_signals;
            const accuracy =
                totalSignals > 0
                    ? ((reactions.length / totalSignals) * 100).toFixed(1)
                    : 0;

            return {
                testId: test.id,
                testNumber: index + 1,
                reactions: reactions,
                missedSignals: test.missed_signals,
                testDuration: test.test_duration,
                createdAt: test.created_at,
                avgReaction:
                    reactions.length > 0
                        ? (
                            reactions.reduce((sum, a) => sum + a, 0) / reactions.length
                        ).toFixed(1)
                        : 0,
                bestReaction: reactions.length > 0 ? Math.min(...reactions) : 0,
                worstReaction: reactions.length > 0 ? Math.max(...reactions) : 0,
                totalReactions: reactions.length,
                totalSignals: totalSignals,
                accuracy: accuracy,
            };
        });

        // 4. Рассчитываем общую статистику по всем тестам
        const allReactions = testsData.flatMap((test) => test.reactions);
        const totalAttempts = allReactions.length;
        const totalMissed = testsData.reduce(
            (sum, test) => sum + test.missedSignals,
            0
        );
        const totalSignals = totalAttempts + totalMissed;
        const avgReaction =
            totalAttempts > 0
                ? (allReactions.reduce((sum, a) => sum + a, 0) / totalAttempts).toFixed(
                    1
                )
                : 0;
        const totalAccuracy =
            totalSignals > 0 ? ((totalAttempts / totalSignals) * 100).toFixed(1) : 0;

        res.render("tests/stats/stats_test_sound_signal", {
            login,
            noData: false,
            stats: {
                totalTests: testsData.length,
                totalAttempts,
                totalMissed,
                totalSignals,
                avgReaction,
                accuracy: totalAccuracy,
                bestReaction: totalAttempts > 0 ? Math.min(...allReactions) : 0,
                worstReaction: totalAttempts > 0 ? Math.max(...allReactions) : 0,
                avgTestDuration:
                    testsData.reduce((sum, test) => sum + test.testDuration, 0) /
                    testsData.length,
            },
            testsData, // передаем данные по каждому тесту отдельно
            chartData: {
                testNumbers: testsData.map((test) => test.testNumber),
                avgReactions: testsData.map((test) => test.avgReaction),
                accuracies: testsData.map((test) => test.accuracy),
            },
        });
    } catch (err) {
        console.error("Ошибка при получении статистики звукового теста:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/stats_test_color_signal/:login", async (req, res) => {
    const {login} = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query("SELECT id FROM users WHERE login = $1", [
            login,
        ]);

        if (user.rows.length === 0) {
            return res.status(404).send("Пользователь не найден");
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT id, reaction_times, correct_answers, missed_clicks, wrong_clicks, test_duration, created_at
             FROM test_color_signal
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render("tests/stats/stats_test_color_signal", {
                login,
                noData: true,
            });
        }

        // 3. Собираем данные по каждому тесту отдельно
        const testsData = result.rows.map((test, index) => {
            const reactions = test.reaction_times || [];
            const totalClicks =
                test.correct_answers + test.missed_clicks + test.wrong_clicks;
            const accuracy =
                totalClicks > 0
                    ? Math.round((test.correct_answers / totalClicks) * 100)
                    : 0;

            return {
                testId: test.id,
                testNumber: index + 1,
                reactions: reactions,
                correctAnswers: test.correct_answers,
                missedClicks: test.missed_clicks,
                wrongClicks: test.wrong_clicks,
                testDuration: test.test_duration,
                accuracy: accuracy,
                createdAt: test.created_at,
                avgReaction:
                    reactions.length > 0
                        ? (
                            reactions.reduce((sum, a) => sum + a, 0) / reactions.length
                        ).toFixed(1)
                        : 0,
                bestReaction: reactions.length > 0 ? Math.min(...reactions) : 0,
                worstReaction: reactions.length > 0 ? Math.max(...reactions) : 0,
                totalReactions: reactions.length,
            };
        });

        // 4. Рассчитываем общую статистику по всем тестам
        const allReactions = testsData.flatMap((test) => test.reactions);
        const totalAttempts = allReactions.length;
        const totalCorrect = testsData.reduce(
            (sum, test) => sum + test.correctAnswers,
            0
        );
        const totalWrong = testsData.reduce(
            (sum, test) => sum + test.wrongClicks,
            0
        );
        const totalMissed = testsData.reduce(
            (sum, test) => sum + test.missedClicks,
            0
        );
        const totalClicks = totalCorrect + totalWrong + totalMissed;
        const totalAccuracy =
            totalClicks > 0 ? Math.round((totalCorrect / totalClicks) * 100) : 0;
        const avgReaction =
            totalAttempts > 0
                ? (allReactions.reduce((sum, a) => sum + a, 0) / totalAttempts).toFixed(
                    1
                )
                : 0;

        res.render("tests/stats/stats_test_color_signal", {
            login,
            noData: false,
            stats: {
                totalTests: testsData.length,
                totalAttempts,
                avgReaction,
                bestReaction: totalAttempts > 0 ? Math.min(...allReactions) : 0,
                worstReaction: totalAttempts > 0 ? Math.max(...allReactions) : 0,
                totalCorrect,
                totalWrong,
                totalMissed,
                totalAccuracy,
                avgTestDuration: (
                    testsData.reduce((sum, test) => sum + test.testDuration, 0) /
                    testsData.length
                ).toFixed(1),
            },
            testsData,
            chartData: {
                testNumbers: testsData.map((test) => test.testNumber),
                avgReactions: testsData.map((test) => test.avgReaction),
                accuracy: testsData.map((test) => test.accuracy),
            },
        });
    } catch (err) {
        console.error("Ошибка при получении статистики:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/stats_test_digital_signal/:login", async (req, res) => {
    const {login} = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query("SELECT id FROM users WHERE login = $1", [
            login,
        ]);

        if (user.rows.length === 0) {
            return res.status(404).send("Пользователь не найден");
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT id,
                    reaction_times,
                    correct_answers,
                    wrong_answers,
                    missed_attempts,
                    test_duration,
                    created_at
             FROM test_digital_signal
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render("tests/stats/stats_test_digital_signal", {
                login,
                noData: true,
            });
        }

        // 3. Собираем данные по каждому тесту отдельно
        const testsData = result.rows.map((test, index) => {
            const reactions = test.reaction_times || [];
            const totalQuestions =
                test.correct_answers + test.wrong_answers + test.missed_attempts;
            const accuracy =
                totalQuestions > 0
                    ? Math.round((test.correct_answers / totalQuestions) * 100)
                    : 0;

            return {
                testId: test.id,
                testNumber: index + 1,
                reactions: reactions,
                correctAnswers: test.correct_answers,
                wrongAnswers: test.wrong_answers,
                missedAttempts: test.missed_attempts,
                testDuration: test.test_duration,
                accuracy: accuracy,
                totalQuestions: totalQuestions,
                createdAt: test.created_at,
                avgReaction:
                    reactions.length > 0
                        ? (
                            reactions.reduce((sum, a) => sum + a, 0) / reactions.length
                        ).toFixed(1)
                        : 0,
                bestReaction: reactions.length > 0 ? Math.min(...reactions) : 0,
                worstReaction: reactions.length > 0 ? Math.max(...reactions) : 0,
                totalReactions: reactions.length,
            };
        });

        // 4. Рассчитываем общую статистику по всем тестам
        const allReactions = testsData.flatMap((test) => test.reactions);
        const totalAttempts = allReactions.length;
        const totalQuestions = testsData.reduce(
            (sum, test) => sum + test.totalQuestions,
            0
        );
        const totalCorrect = testsData.reduce(
            (sum, test) => sum + test.correctAnswers,
            0
        );
        const totalAccuracy =
            totalQuestions > 0
                ? Math.round((totalCorrect / totalQuestions) * 100)
                : 0;

        const avgReaction =
            totalAttempts > 0
                ? (allReactions.reduce((sum, a) => sum + a, 0) / totalAttempts).toFixed(
                    1
                )
                : 0;

        res.render("tests/stats/stats_test_digital_signal", {
            login,
            noData: false,
            stats: {
                totalTests: testsData.length,
                totalAttempts,
                totalQuestions,
                totalCorrect,
                totalWrong: testsData.reduce((sum, test) => sum + test.wrongAnswers, 0),
                totalMissed: testsData.reduce(
                    (sum, test) => sum + test.missedAttempts,
                    0
                ),
                avgAccuracy: totalAccuracy,
                avgReaction,
                bestReaction: totalAttempts > 0 ? Math.min(...allReactions) : 0,
                worstReaction: totalAttempts > 0 ? Math.max(...allReactions) : 0,
                avgTestDuration: (
                    testsData.reduce((sum, test) => sum + test.testDuration, 0) /
                    testsData.length
                ).toFixed(1),
            },
            testsData, // передаем данные по каждому тесту отдельно
            chartData: {
                testNumbers: testsData.map((test) => test.testNumber),
                avgReactions: testsData.map((test) => test.avgReaction),
                accuracy: testsData.map((test) => test.accuracy),
            },
        });
    } catch (err) {
        console.error("Ошибка при получении статистики:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/stats_test_audio_sum/:login", async (req, res) => {
    const {login} = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query("SELECT id FROM users WHERE login = $1", [
            login,
        ]);

        if (user.rows.length === 0) {
            return res.status(404).send("Пользователь не найден");
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT id, reaction_times, correct_answers, wrong_answers, test_duration, created_at
             FROM test_audio_sum
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render("tests/stats/stats_test_audio_sum", {
                login,
                noData: true,
            });
        }

        // 3. Собираем данные по каждому тесту отдельно
        const testsData = result.rows.map((test, index) => {
            const reactions = test.reaction_times || [];
            const totalAnswers = test.correct_answers + test.wrong_answers;
            const accuracy =
                totalAnswers > 0
                    ? Math.round((test.correct_answers / totalAnswers) * 100)
                    : 0;

            return {
                testId: test.id,
                testNumber: index + 1,
                reactions: reactions,
                correctAnswers: test.correct_answers,
                wrongAnswers: test.wrong_answers,
                accuracy: accuracy,
                testDuration: test.test_duration,
                createdAt: test.created_at,
                avgReaction:
                    reactions.length > 0
                        ? (
                            reactions.reduce((sum, a) => sum + a, 0) / reactions.length
                        ).toFixed(1)
                        : 0,
                bestReaction: reactions.length > 0 ? Math.min(...reactions) : 0,
                worstReaction: reactions.length > 0 ? Math.max(...reactions) : 0,
                totalReactions: reactions.length,
            };
        });

        // 4. Рассчитываем общую статистику по всем тестам
        const allReactions = testsData.flatMap((test) => test.reactions);
        const totalAttempts = allReactions.length;
        const totalCorrect = testsData.reduce(
            (sum, test) => sum + test.correctAnswers,
            0
        );
        const totalWrong = testsData.reduce(
            (sum, test) => sum + test.wrongAnswers,
            0
        );
        const totalAccuracy =
            totalCorrect + totalWrong > 0
                ? Math.round((totalCorrect / (totalCorrect + totalWrong)) * 100)
                : 0;
        const avgReaction =
            totalAttempts > 0
                ? (allReactions.reduce((sum, a) => sum + a, 0) / totalAttempts).toFixed(
                    1
                )
                : 0;

        res.render("tests/stats/stats_test_audio_sum", {
            login,
            noData: false,
            stats: {
                totalTests: testsData.length,
                totalAttempts,
                totalCorrect,
                totalWrong,
                totalAccuracy,
                avgReaction,
                bestReaction: totalAttempts > 0 ? Math.min(...allReactions) : 0,
                worstReaction: totalAttempts > 0 ? Math.max(...allReactions) : 0,
                avgTestDuration: (
                    testsData.reduce((sum, test) => sum + test.testDuration, 0) /
                    testsData.length
                ).toFixed(1),
            },
            testsData,
            chartData: {
                testNumbers: testsData.map((test) => test.testNumber),
                avgReactions: testsData.map((test) => test.avgReaction),
                accuracyData: testsData.map((test) => test.accuracy),
            },
        });
    } catch (err) {
        console.error("Ошибка при получении статистики:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/stats_test_simple_rdo/:login", async (req, res) => {
    const {login} = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query("SELECT id FROM users WHERE login = $1", [
            login,
        ]);

        if (user.rows.length === 0) {
            return res.status(404).send("Пользователь не найден");
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT id, attempts, test_duration, created_at
             FROM test_simple_rdo
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render("tests/stats/stats_test_simple_rdo", {
                login,
                noData: true,
            });
        }

        // 3. Собираем данные по каждому тесту отдельно
        const testsData = result.rows.map((test, index) => {
            const attempts = test.attempts || [];
            const signedErrors = attempts.map((a) => a.signedError);
            const absoluteErrors = attempts.map((a) => Math.abs(a.signedError));

            return {
                testId: test.id,
                testNumber: index + 1,
                attempts: attempts,
                testDuration: test.test_duration,
                createdAt: test.created_at,
                avgSignedError:
                    signedErrors.length > 0
                        ? (
                            signedErrors.reduce((sum, a) => sum + a, 0) /
                            signedErrors.length
                        ).toFixed(2)
                        : 0,
                avgAbsoluteError:
                    absoluteErrors.length > 0
                        ? (
                            absoluteErrors.reduce((sum, a) => sum + a, 0) /
                            absoluteErrors.length
                        ).toFixed(2)
                        : 0,
                bestResult:
                    absoluteErrors.length > 0
                        ? Math.min(...absoluteErrors).toFixed(2)
                        : 0,
                worstResult:
                    absoluteErrors.length > 0
                        ? Math.max(...absoluteErrors).toFixed(2)
                        : 0,
                totalAttempts: attempts.length,
                prematureCount: signedErrors.filter((e) => e > 0).length,
                delayedCount: signedErrors.filter((e) => e < 0).length,
                stdDeviation:
                    signedErrors.length > 0
                        ? Math.sqrt(
                            signedErrors.reduce(
                                (sum, a) =>
                                    sum +
                                    Math.pow(
                                        a -
                                        signedErrors.reduce((sum, a) => sum + a, 0) /
                                        signedErrors.length,
                                        2
                                    ),
                                0
                            ) / signedErrors.length
                        ).toFixed(2)
                        : 0,
            };
        });

        // 4. Рассчитываем общую статистику по всем тестам
        const allSignedErrors = testsData.flatMap((test) =>
            test.attempts.map((a) => a.signedError)
        );
        const allAbsoluteErrors = allSignedErrors.map((e) => Math.abs(e));
        const totalAttempts = allSignedErrors.length;

        res.render("tests/stats/stats_test_simple_rdo", {
            login,
            noData: false,
            stats: {
                totalTests: testsData.length,
                totalAttempts,
                avgSignedError:
                    totalAttempts > 0
                        ? (
                            allSignedErrors.reduce((sum, a) => sum + a, 0) / totalAttempts
                        ).toFixed(2)
                        : 0,
                avgAbsoluteError:
                    totalAttempts > 0
                        ? (
                            allAbsoluteErrors.reduce((sum, a) => sum + a, 0) / totalAttempts
                        ).toFixed(2)
                        : 0,
                bestResult:
                    totalAttempts > 0 ? Math.min(...allAbsoluteErrors).toFixed(2) : 0,
                worstResult:
                    totalAttempts > 0 ? Math.max(...allAbsoluteErrors).toFixed(2) : 0,
                prematureCount: allSignedErrors.filter((e) => e > 0).length,
                delayedCount: allSignedErrors.filter((e) => e < 0).length,
                stdDeviation:
                    totalAttempts > 0
                        ? Math.sqrt(
                            allSignedErrors.reduce(
                                (sum, a) =>
                                    sum +
                                    Math.pow(
                                        a -
                                        allSignedErrors.reduce((sum, a) => sum + a, 0) /
                                        totalAttempts,
                                        2
                                    ),
                                0
                            ) / totalAttempts
                        ).toFixed(2)
                        : 0,
            },
            testsData,
            chartData: {
                testNumbers: testsData.map((test) => test.testNumber),
                avgSignedErrors: testsData.map((test) => test.avgSignedError),
                avgAbsoluteErrors: testsData.map((test) => test.avgAbsoluteError),
            },
        });
    } catch (err) {
        console.error("Ошибка при получении статистики:", err);
        res.status(500).send("Ошибка сервера");
    }
});

app.get("/stats_test_complex_rdo/:login", async (req, res) => {
    const {login} = req.params;
    try {
        // 1. Получаем данные пользователя
        const user = await pool.query("SELECT id FROM users WHERE login = $1", [
            login,
        ]);

        if (user.rows.length === 0) {
            return res.status(404).send("Пользователь не найден");
        }

        const userId = user.rows[0].id;

        // 2. Получаем все попытки пользователя для этого теста
        const result = await pool.query(
            `SELECT id, responses, circle_speeds, test_duration, created_at
             FROM test_complex_rdo
             WHERE user_id = $1
             ORDER BY created_at ASC`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.render("tests/stats/stats_test_complex_rdo", {
                login,
                noData: true,
            });
        }

        // 3. Собираем данные по каждому тесту отдельно
        const testsData = result.rows.map((test, index) => {
            const responses = test.responses || {1: [], 2: [], 3: []};
            const circleSpeeds = test.circle_speeds || {1: 0, 2: 0, 3: 0};

            // Собираем все реакции из всех кругов
            const allReactions = [...responses[1], ...responses[2], ...responses[3]];

            // Рассчитываем статистику для каждого круга
            const circleStats = {
                1: calculateCircleStats(responses[1], circleSpeeds[1]),
                2: calculateCircleStats(responses[2], circleSpeeds[2]),
                3: calculateCircleStats(responses[3], circleSpeeds[3]),
            };

            // Общая статистика по тесту
            const avgReaction =
                allReactions.length > 0
                    ? (
                        allReactions.reduce((sum, a) => sum + Math.abs(a), 0) /
                        allReactions.length
                    ).toFixed(1)
                    : 0;

            const bestReaction =
                allReactions.length > 0 ? Math.min(...allReactions.map(Math.abs)) : 0;

            const worstReaction =
                allReactions.length > 0 ? Math.max(...allReactions.map(Math.abs)) : 0;

            return {
                testId: test.id,
                testNumber: index + 1,
                responses: responses,
                circleSpeeds: circleSpeeds,
                testDuration: test.test_duration,
                createdAt: test.created_at,
                avgReaction: avgReaction,
                bestReaction: bestReaction,
                worstReaction: worstReaction,
                totalReactions: allReactions.length,
                circleStats: circleStats,
            };
        });

        // 4. Рассчитываем общую статистику по всем тестам
        const allReactions = testsData.flatMap((test) => [
            ...test.responses[1],
            ...test.responses[2],
            ...test.responses[3],
        ]);

        const totalAttempts = allReactions.length;
        const avgReaction =
            totalAttempts > 0
                ? (
                    allReactions.reduce((sum, a) => sum + Math.abs(a), 0) /
                    totalAttempts
                ).toFixed(1)
                : 0;

        res.render("tests/stats/stats_test_complex_rdo", {
            login,
            noData: false,
            stats: {
                totalTests: testsData.length,
                totalAttempts,
                avgReaction,
                bestReaction:
                    totalAttempts > 0 ? Math.min(...allReactions.map(Math.abs)) : 0,
                worstReaction:
                    totalAttempts > 0 ? Math.max(...allReactions.map(Math.abs)) : 0,
            },
            testsData,
            chartData: {
                testNumbers: testsData.map((test) => test.testNumber),
                avgReactions: testsData.map((test) => test.avgReaction),
            },
        });
    } catch (err) {
        console.error("Ошибка при получении статистики:", err);
        res.status(500).send("Ошибка сервера");
    }
});

// Вспомогательная функция для расчета статистики по каждому кругу
function calculateCircleStats(responses, speed) {
    if (responses.length === 0) {
        return {
            count: 0,
            avgError: 0,
            avgAbsError: 0,
            stdDev: 0,
            speed: speed,
        };
    }

    const avgError =
        responses.reduce((sum, val) => sum + val, 0) / responses.length;
    const avgAbsError =
        responses.reduce((sum, val) => sum + Math.abs(val), 0) / responses.length;

    const variance =
        responses.reduce((sum, val) => sum + Math.pow(val - avgError, 2), 0) /
        responses.length;
    const stdDev = Math.sqrt(variance);

    return {
        count: responses.length,
        avgError: avgError.toFixed(1),
        avgAbsError: avgAbsError.toFixed(1),
        stdDev: stdDev.toFixed(1),
        speed: speed,
    };
}

// -----------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}/main`);
});
