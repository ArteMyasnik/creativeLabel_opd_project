const pool = require('../../db/db');

function hasNumber(str) {
    return /\d/.test(str);
}

function hasSpecialCharacter(password) {
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialCharacters.test(password);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function hasUpperCase(str) {
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
            return true;
        }
    }
    return false;
}

class ActionController {
    async login_page(req, res) {
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

    async registration_page(req, res) {
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

    async main_page(req, res) {
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

module.exports = new ActionController();