const Router = require('express');
const router = new Router();
const UserController = require('./userController');

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);

// Профиль пользователя
router.put('/profile', UserController.updateProfile); // Новый маршрут для обновления профиля
// Изменение пароля
router.put('/profile', userController.changePassword);
// Изменение логина
router.put('/profile', userController.changeLogin);

// router.get('/user/:id', UserController.getOneUser);
// router.get('/user', UserController.getUsers);
// router.post('/user', UserController.createUser);
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);

module.exports = router;