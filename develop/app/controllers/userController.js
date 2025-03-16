const pool = require('../db/db');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');


// Функция для хэширования пароля
async function hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

bcryptjs.setRandomFallback(() => {
    const buf = crypto.randomBytes(60);
    return buf;
});

async function comparePassword(password, hashedPassword) {
    return await bcryptjs.compare(password, hashedPassword);
}

class UserController {
    // async createUser(req, res) {
    //     try {
    //         const { name, email } = req.body;
    //         const newUser = await pool.query(
    //             'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
    //             [name, email]
    //         );
    //         res.json(newUser.rows[0]);
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).send('Server Error');
    //     }
    // }
    //
    // async getUsers(req, res) {
    //     try {
    //         const allUsers = await pool.query('SELECT * FROM users');
    //         res.json(allUsers.rows);
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).send('Server Error');
    //     }
    // }
    //
    // async getOneUser(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    //         if (user.rows.length === 0) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }
    //         res.json(user.rows[0]);
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).send('Server Error');
    //     }
    // }
    //
    // async updateUser(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const { name, email } = req.body;
    //         const updatedUser = await pool.query(
    //             'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    //             [name, email, id]
    //         );
    //         if (updatedUser.rows.length === 0) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }
    //         res.json(updatedUser.rows[0]);
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).send('Server Error');
    //     }
    // }
    //
    // async deleteUser(req, res) {
    //     try {
    //         const { id } = req.params;
    //         const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    //         if (deletedUser.rows.length === 0) {
    //             return res.status(404).json({ message: 'User not found' });
    //         }
    //         res.json({ message: 'User deleted' });
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).send('Server Error');
    //     }
    // async getProfile(req, res) {
    //     try {
    //         const { login } = req.body;
    //
    //         const profileUser = await pool.query(
    //             `SELECT email, age, sex FROM users WHERE login = $1`,
    //             [login]
    //         );
    //
    //         if (profileUser.rows.length === 0) {
    //             return res.status(404).json({ message: 'Пользователь не найден' });
    //         }
    //
    //         const userInfo = profileUser.rows[0];
    //
    //         const { email, age, sex } = userInfo;
    //
    //         // Возвращаем из этой функции все данные пользователя.
    //         // Пароль мы не будем возвращать, так как пароль хранится в захэшированном состоянии.
    //         res.status(200).json({
    //             message: 'Данные получены успешно',
    //             user: { login, email, age, sex }
    //         });
    //
    //     } catch (err) {
    //         console.error(err.message);
    //         res.status(500).json({ message: "Server error" });
    //     }
    // }

    // }

    async registration(req, res) {
        try {
            const {login, email, password} = req.body;
            const hashedPassword = await hashPassword(password);

            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );
            if (checkUser > 0) {
                res.status(409).json({message: 'Пользователь с таким логином уже зарегистрирован'});
            } else {
                // Сохраняем данные пользователя в сессии
                req.session.login = login;
                const isAdmin = await comparePassword('adminPassword123!!!', hashedPassword);
                if (isAdmin) {
                    const registrationUser = await pool.query(
                        'INSERT INTO users (login, email, password_hash, isAdmin, isModerator) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                        [login, email, hashedPassword, 'true', 'true']
                    );
                    req.session.isAdmin = true; // Если пароль adminPassword123!!! , то пользователь админ
                } else {
                    const registrationUser = await pool.query(
                        'INSERT INTO users (login, email, password_hash, isAdmin, isModerator) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                        [login, email, hashedPassword, 'false', 'false']
                    );
                    req.session.isAdmin = false; // По умолчанию пользователь не администратор
                }
                res.status(201).json({message: 'Пользователь успешно зарегистрирован', user: login});
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }

    async login(req, res) {
        try {
            const {login, password} = req.body;

            const result = await pool.query(
                `SELECT password_hash, isAdmin FROM users WHERE login = $1`,
                [login]
            );

            const hashedPasswordDB = result.rows[0].password_hash;
            const isMatch = await comparePassword(password, hashedPasswordDB);
            if (!isMatch) {
                res.status(400).json({message: 'Логин или пароль введены неверно'});
            } else {
                // Сохраняем данные пользователя в сессии
                req.session.login = login;
                req.session.isAdmin = result.rows[0].isadmin; // Сохраняем роль пользователя
                res.status(200).json({message: 'Вход выполнен успешно', user: login});
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }

    async updateAge(req, res) {
        try {
            const { login } = req.params;
            const { age } = req.body;

            // Проверяем, существует ли пользователь с таким логином
            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            if (checkUser.rows[0].count > 0) {
                const updatedUser = await pool.query(
                    'UPDATE users SET age = $1 WHERE login = $2 RETURNING *',
                    [age, login]
                );

                res.status(200).json({
                    success: true,
                    message: 'Возраст пользователя успешно обновлен',
                    user: updatedUser.rows[0]
                });
            } else {
                res.status(404).json({ message: 'Пользователь с таким логином не найден' });
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server error" });
        }
    }

    async updateSex(req, res) {
        try {
            const { login } = req.params;
            const { sex } = req.body;

            // Проверяем, существует ли пользователь с таким логином
            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            if (checkUser.rows[0].count > 0) {
                const updatedUser = await pool.query(
                    'UPDATE users SET sex = $1 WHERE login = $2 RETURNING *',
                    [sex, login]
                );

                res.status(200).json({
                    success: true,
                    message: 'Пол пользователя успешно обновлен',
                    user: updatedUser.rows[0]
                });
            } else {
                res.status(404).json({ message: 'Пользователь с таким логином не найден' });
            }

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server error" });
        }
    }
    
    async changePassword(req, res) {
        try {
            const { login } = req.params;
            const { oldPassword, newPassword, confirmNewPassword } = req.body;

            if (newPassword !== confirmNewPassword) {
                return res.status(400).json({ message: 'Новый пароль и подтверждение не совпадают' });
            }

            // Проверяем, существует ли пользователь с таким логином
            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );
            if (checkUser > 0) {
                res.status(409).json({message: 'Пользователь с таким логином уже зарегистрирован'});
            }

            const userPassword = await pool.query(
                'SELECT password_hash FROM users WHERE login = $1',
                [login]
            );

            const hashedPassword = userPassword.rows[0].password_hash;

            // Проверка старого пароля
            const isOldPasswordValid = await comparePassword(oldPassword, hashedPassword);
            if (!isOldPasswordValid) {
                return res.status(400).json({ message: 'Неверный текущий пароль' });
            }

            // Проверка, что новый пароль отличается от старого
            const isSamePassword = await comparePassword(newPassword, hashedPassword);
            if (isSamePassword) {
                return res.status(400).json({ message: 'Новый пароль должен отличаться от старого' });
            }

            const newHashedPassword = await hashPassword(newPassword);

            // Обновление пароля в базе данных
            await pool.query(
                'UPDATE users SET password_hash = $1 WHERE login = $2',
                [newHashedPassword, login]
            );

            res.status(200).json({
                success: true,
                message: 'Пароль успешно изменен'
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server error" });
        }
    }

    async changeEmail(req, res) {
        try {
            const { login } = req.params;
            const { email } = req.body;

            // Проверка доступности нового логина
            const checkLogin = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            // Если логин уже занят
            if (checkLogin.rows[0].count > 0) {
                return res.status(409).json({ message: 'Этот email уже занят' });
            }

            // Обновление логина
            await pool.query(
                'UPDATE users SET email = $1 WHERE login = $2',
                [email, login]
            );

            res.status(200).json({
                success: true,
                message: 'Email успешно изменен'
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server error" });
        }
    }

    async assignExperts(req, res) {
        try {
            const { login } = req.body;
            const user = await pool.query(
                'SELECT * FROM users WHERE login = $1',
                [login]
            );

            if (user.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь с таким логином не найден' });
            }

            const updatedUser = await pool.query(
                'UPDATE users SET isExpert = true WHERE login = $1 RETURNING *',
                [login]
            );

            if (updatedUser.rows.length === 0) {
                return res.status(500).json({ message: 'Не удалось обновить статус пользователя' });
            }

            res.status(200).json({
                message: 'Пользователь назначен экспертом',
                user: updatedUser.rows[0]
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Ошибка сервера" });
        }
    }

    async testVisualSignal(req, res) {
        try {
            const { login, averageReactionTime, standardDeviation, missedSignals } = req.body;

            console.log(login, averageReactionTime, standardDeviation, missedSignals)

            // Сохраняем результаты теста в базу данных
            // const result = await pool.query(
            //     'INSERT INTO reaction_tests (login, average_time, std_dev, missed_signals) VALUES ($1, $2, $3, $4) RETURNING *',
            //     [login, averageTime, stdDev, missedSignals]
            // );

            res.status(200).json({
                success: true,
                message: 'Результаты теста успешно сохранены',
                data: result.rows[0]
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Ошибка сервера"
            });
        }
    }

    async testColorSignal(req, res) {
        try {
            const { login, averageReactionTime, standardDeviation, correctAnswers, missedClicks, wrongClicks } = req.body;

            console.log(login, averageReactionTime, standardDeviation, correctAnswers, missedClicks, wrongClicks)

            // Сохраняем результаты теста в базу данных
            // const result = await pool.query(
            //     'INSERT INTO reaction_tests (login, average_time, std_dev, missed_signals) VALUES ($1, $2, $3, $4) RETURNING *',
            //     [login, averageTime, stdDev, missedSignals]
            // );

            res.status(200).json({
                success: true,
                message: 'Результаты теста успешно сохранены',
                data: result.rows[0]
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Ошибка сервера"
            });
        }
    }

    async testDigitalSignal(req, res) {
        try {
            const { login, averageReactionTime, standardDeviation, correctAnswers, wrongAnswers, missedAttempts, accuracy } = req.body;

            console.log(login, averageReactionTime, standardDeviation, correctAnswers, wrongAnswers, missedAttempts, accuracy)

            // Сохраняем результаты теста в базу данных
            // const result = await pool.query(
            //     'INSERT INTO reaction_tests (login, average_time, std_dev, missed_signals) VALUES ($1, $2, $3, $4) RETURNING *',
            //     [login, averageTime, stdDev, missedSignals]
            // );

            res.status(200).json({
                success: true,
                message: 'Результаты теста успешно сохранены',
                data: result.rows[0]
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Ошибка сервера"
            });
        }
    }
}

module.exports = new UserController();
