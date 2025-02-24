const Router = require('express');
const router = new Router();
const UserController = require('./userController');

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);

// Профиль пользователя
router.put('/profile', UserController.updateProfile); // Новый маршрут для обновления профиля

// router.get('/user/:id', UserController.getOneUser);
// router.get('/user', UserController.getUsers);
// router.post('/user', UserController.createUser);
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);

module.exports = router;