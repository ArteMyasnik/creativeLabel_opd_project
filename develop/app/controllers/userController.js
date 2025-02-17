const pool = require('../db/db'); // Путь исправлен

class UserController {
    async createUser(req, res) {
        try {
            const { name, email } = req.body;
            const newUser = await pool.query(
                'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
                [name, email]
            );
            res.json(newUser.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    async getUsers(req, res) {
        try {
            const allUsers = await pool.query('SELECT * FROM users');
            res.json(allUsers.rows);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    async getOneUser(req, res) {
        try {
            const { id } = req.params;
            const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            if (user.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email } = req.body;
            const updatedUser = await pool.query(
                'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
                [name, email, id]
            );
            if (updatedUser.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(updatedUser.rows[0]);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
            if (deletedUser.rows.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }


}

module.exports = new UserController();