const pool = require('../db/db');
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');

// Функция для хэширования пароля
async function hashPassword(password) {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
}

// Для выравнивания под одинаковый размер
bcryptjs.setRandomFallback(() => {
    const buf = crypto.randomBytes(60);
    return buf;
});

// Функция сравнения паролей хэшированных и строковых
async function comparePassword(password, hashedPassword) {
    return await bcryptjs.compare(password, hashedPassword);
}

class ActionController {
    async assignExperts(req, res) {
        try {
            const {login} = req.body;

            // Проверяем количество экспертов
            const experts = await pool.query('SELECT * FROM users WHERE isExpert = true');
            if (experts.rows.length >= 8) {
                return res.status(400).json({message: 'Достигнуто максимальное количество экспертов'});
            }

            const user = await pool.query(
                'SELECT * FROM users WHERE login = $1',
                [login]
            );

            if (user.rows.length === 0) {
                return res.status(404).json({message: 'Пользователь с таким логином не найден'});
            }

            const updatedUser = await pool.query(
                'UPDATE users SET isExpert = true WHERE login = $1 RETURNING *',
                [login]
            );

            if (updatedUser.rows.length === 0) {
                return res.status(500).json({message: 'Не удалось обновить статус пользователя'});
            }

            res.status(200).json({
                message: 'Пользователь назначен экспертом',
                user: updatedUser.rows[0]
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({message: "Ошибка сервера"});
        }
    }

    async resetExperts(req, res) {
        try {
            await pool.query('UPDATE users SET isExpert = false WHERE isExpert = true');

            const users = await pool.query('SELECT * FROM users');
            res.status(200).json({
                message: 'Эксперты сброшены',
                users: users.rows
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({message: "Ошибка сервера"});
        }
    }

    async testVisualSignal(req, res) {
        try {
            const { login, reactionTimes, missedSignals, testDuration } = req.body;

            if (login == null) {
                res.status(200).json({
                    success: true,
                    message: "Результаты теста не сохранены"
                });
            }

            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            if (checkUser.rows[0].count === 0) {
                res.status(404).json({message: 'Пользователь с таким логином не найден'});
            } else {
                const user = await pool.query(
                    'SELECT id FROM users WHERE login = $1',
                    [login]
                )

                // Сохраняем результаты теста в базу данных
                const result = await pool.query(
                    'INSERT INTO test_visual_signal (user_id, reaction_times, missed_signals, test_duration) VALUES ($1, $2, $3, $4) RETURNING *',
                    [user.rows[0].id, reactionTimes, missedSignals, testDuration]
                );

                res.status(201).json({
                    success: true,
                    message: 'Результаты теста успешно сохранены',
                    data: result.rows[0]
                });
            }
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
            const { login, reactionTimes, correctAnswers, missedClicks, wrongClicks, testDuration } = req.body;

            if (login == null) {
                res.status(200).json({
                    success: true,
                    message: "Результаты теста не сохранены"
                });
            }

            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            if (checkUser.rows[0].count === 0) {
                res.status(404).json({message: 'Пользователь с таким логином не найден'});
            } else {
                const user = await pool.query(
                    'SELECT id FROM users WHERE login = $1',
                    [login]
                )

                // Сохраняем результаты теста в базу данных
                const result = await pool.query(
                    'INSERT INTO test_color_signal (user_id, reaction_times, correct_answers, missed_clicks, wrong_clicks, test_duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [user.rows[0].id, reactionTimes, correctAnswers, missedClicks, wrongClicks, testDuration]
                );

                res.status(201).json({
                    success: true,
                    message: 'Результаты теста успешно сохранены',
                    data: result.rows[0]
                });
            }
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
            const { login, reactionTimes, correctAnswers, wrongAnswers, missedAttempts, testDuration } = req.body;

            if (login == null) {
                res.status(200).json({
                    success: true,
                    message: "Результаты теста не сохранены"
                });
            }

            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            if (checkUser.rows[0].count === 0) {
                res.status(404).json({message: 'Пользователь с таким логином не найден'});
            } else {
                const user = await pool.query(
                    'SELECT id FROM users WHERE login = $1',
                    [login]
                )

                // Сохраняем результаты теста в базу данных
                const result = await pool.query(
                    'INSERT INTO test_digital_signal (user_id, reaction_times, correct_answers, wrong_answers, missed_attempts, test_duration) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                    [user.rows[0].id, reactionTimes, correctAnswers, wrongAnswers, missedAttempts, testDuration]
                );

                res.status(201).json({
                    success: true,
                    message: 'Результаты теста успешно сохранены',
                    data: result.rows[0]
                });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Ошибка сервера"
            });
        }
    }

    async testSimpleRdo(req, res) {
        try {
            const { login, attempts, testDuration } = req.body;

            if (login == null) {
                res.status(200).json({
                    success: true,
                    message: "Результаты теста не сохранены"
                });
            }

            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            if (checkUser.rows[0].count === 0) {
                res.status(404).json({message: 'Пользователь с таким логином не найден'});
            } else {
                const user = await pool.query(
                    'SELECT id FROM users WHERE login = $1',
                    [login]
                )

                // Если необходимо вычисляем все показатели на сервере
                // const signedErrors = attempts.map(a => a.signedError);
                // const absErrors = attempts.map(a => a.absoluteError);
                // const premature = signedErrors.filter(e => e > 0);
                // const delayed = signedErrors.filter(e => e < 0);

                // Сохраняем результаты теста в базу данных
                const result = await pool.query(
                    'INSERT INTO test_simple_rdo (user_id, attempts, test_duration) VALUES ($1, $2, $3) RETURNING *',
                    [user.rows[0].id, JSON.stringify(attempts), testDuration]
                );

                res.status(201).json({
                    success: true,
                    message: 'Результаты теста успешно сохранены',
                    data: result.rows[0]
                });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Ошибка сервера"
            });
        }
    }

    async testComplexRdo(req, res) {
        try {
            const { login, responses, circleSpeeds, testDuration } = req.body;

            if (login == null) {
                res.status(200).json({
                    success: true,
                    message: "Результаты теста не сохранены"
                });
            }

            const checkUser = await pool.query(
                'SELECT COUNT(*) FROM users WHERE login = $1',
                [login]
            );

            if (checkUser.rows[0].count === 0) {
                res.status(404).json({message: 'Пользователь с таким логином не найден'});
            } else {
                const user = await pool.query(
                    'SELECT id FROM users WHERE login = $1',
                    [login]
                )

                // Сохраняем результаты теста в базу данных
                const result = await pool.query(
                    'INSERT INTO test_complex_rdo (user_id, responses, circle_speeds, test_duration) VALUES ($1, $2, $3, $4) RETURNING *',
                    [user.rows[0].id, JSON.stringify(responses), JSON.stringify(circleSpeeds), testDuration]
                );

                res.status(201).json({
                    success: true,
                    message: 'Результаты теста успешно сохранены',
                    data: result.rows[0]
                });
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Ошибка сервера"
            });
        }
    }

    async createProfession(req, res) {
        try {
            const {name, description} = req.body;

            const checkProfession = await pool.query(
                'SELECT COUNT(*) FROM professions WHERE name = $1',
                [name]
            );
            if (checkProfession > 0) {
                res.status(409).json({message: 'Профессия с таким названием уже зарегистрирована', success: false});
            } else {
                const createProfession = await pool.query(
                    'INSERT INTO professions (name, description) VALUES ($1, $2) RETURNING *',
                    [name, description]
                );
                res.status(201).json({message: 'Профессия успешно зарегистрирована', profession: name, success: true});
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }

    async saveProfessionsRating(req, res) {
        const { login, profession_name, pvks } = req.body;
        const user = await pool.query(
            'SELECT id FROM users WHERE login = $1',
            [login]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Пользователь не найден'
            });
        }

        const userId = user.rows[0].id;

        // Валидация входных данных
        if (!profession_name || !pvks || !Array.isArray(pvks) || pvks.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Необходимо выбрать и упорядочить минимум 3 ПВК'
            });
        }

        try {
            // 1. Получаем ID профессии
            const professionRes = await pool.query(
                'SELECT id FROM professions WHERE name = $1',
                [profession_name]
            );

            if (professionRes.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Профессия не найдена'
                });
            }

            const professionId = professionRes.rows[0].id;

            // 2. Проверяем существующие оценки
            const existingRatingsRes = await pool.query(
                'SELECT 1 FROM profession_pvk WHERE profession_id = $1 AND user_id = $2 LIMIT 1',
                [professionId, userId]
            );

            const isUpdate = existingRatingsRes.rows.length > 0;

            // 3. Начинаем транзакцию
            const client = await pool.connect();

            try {
                await client.query('BEGIN');

                // 4. Удаляем старые оценки при обновлении
                if (isUpdate) {
                    await client.query(
                        'DELETE FROM profession_pvk WHERE profession_id = $1 AND user_id = $2',
                        [professionId, userId]
                    );
                }

                // 5. Подготавливаем оценки от 10 до 1
                const pvksWithMarks = pvks.map((pvk, index) => ({
                    ...pvk,
                    mark: 10 - index // Первый элемент получает 10, последний - 10 - (n-1)
                }));

                // 6. Вставляем новые оценки с рассчитанными marks
                const insertValues = pvksWithMarks.map(pvk =>
                    `(${professionId}, ${userId}, ${pvk.pvk_id}, ${pvk.mark})`
                ).join(',');

                await client.query(
                    `INSERT INTO profession_pvk 
                (profession_id, user_id, pvk_id, mark)
                VALUES ${insertValues}`
                );

                // 7. Обновляем счетчик экспертов только для новых оценок
                if (!isUpdate) {
                    await client.query(
                        'UPDATE professions SET expert_count = expert_count + 1 WHERE id = $1',
                        [professionId]
                    );
                }

                await client.query('COMMIT');

                return res.json({
                    success: true,
                    message: isUpdate ? 'Оценки успешно обновлены' : 'Оценки успешно сохранены',
                    profession: profession_name,
                    pvks: pvksWithMarks // Возвращаем ПВК с оценками для отладки
                });

            } catch (err) {
                await client.query('ROLLBACK');
                console.error('Ошибка транзакции:', err);
                throw err;
            } finally {
                client.release();
            }

        } catch (err) {
            console.error('Ошибка сохранения оценок:', err);
            return res.status(500).json({
                success: false,
                message: 'Ошибка сервера при сохранении оценок'
            });
        }
    };
}

module.exports = new ActionController();