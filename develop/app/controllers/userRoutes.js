const Router = require('express');
const router = new Router();
const UserController = require('./userController');

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);

// Профиль пользователя
router.put('/profile/:login/update-info', UserController.updateProfile);
// Изменение пароля
router.put('/profile/:login/update-password', UserController.changePassword);
// Изменение логина
router.put('/profile/:login/update-login', UserController.changeLogin);
// Назначение эксперта
router.put('/experts', UserController.assignExperts);

// router.get('/user/:id', UserController.getOneUser);
// router.get('/user', UserController.getUsers);
// router.post('/user', UserController.createUser);
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);

module.exports = router;