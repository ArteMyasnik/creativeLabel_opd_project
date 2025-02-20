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
                const registrationUser = await pool.query(
                    'INSERT INTO users (login, email, password_hash) VALUES ($1, $2, $3) RETURNING *',
                    [login, email, hashedPassword]
                );
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
                `SELECT password_hash FROM users WHERE login = $1`,
                [login]
            );

            const hashedPasswordDB = result.rows[0].password_hash;
            const isMatch = await comparePassword(password, hashedPasswordDB);
            if (!isMatch) {
                res.status(400).json({message: 'Логин или пароль введены неверно'});
            } else {
                res.status(200).json({message: 'Вход выполнен успешно', user: login});
            }
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }

    async profile(req, res) {
        try {
            const { login } = req.body;

            const profileUser = await pool.query(
                `SELECT email, age, sex FROM users WHERE login = $1`,
                [login]
            );

            if (profileUser.rows.length === 0) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            const userInfo = profileUser.rows[0];

            const { email, age, sex } = userInfo;

            // Возвращаем из этой функции все данные пользователя.
            // Пароль мы не будем возвращать, так как пароль хранится в захэшированном состоянии.
            res.status(200).json({
                message: 'Данные получены успешно',
                user: { login, email, age, sex }
            });

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server error" });
        }
    }
}

module.exports = new UserController();