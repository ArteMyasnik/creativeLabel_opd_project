const Router = require('express');
const router = new Router();
const UserController = require('./userController');

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);

// Изменение возраста
router.put('/profile/:login/update-age', UserController.updateAge);
// Изменение пола
router.put('/profile/:login/update-sex', UserController.updateSex);
// Изменение пароля
router.put('/profile/:login/update-password', UserController.changePassword);
// Изменение email
router.put('/profile/:login/update-email', UserController.changeEmail);
// Назначение эксперта
router.put('/experts', UserController.assignExperts);

// router.get('/user/:id', UserController.getOneUser);
// router.get('/user', UserController.getUsers);
// router.post('/user', UserController.createUser);
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);

module.exports = router;