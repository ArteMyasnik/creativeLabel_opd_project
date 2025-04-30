const Router = require('express');
const router = new Router();
const UserController = require('./userController');
const ActionController = require('./actionController');

// Регистрация
router.post('/registration', UserController.registration);
// Вход
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
router.put('/experts', ActionController.assignExperts)
// Сброс эксперта
router.post('/experts/reset', ActionController.resetExperts);
// Создание профессии
router.post('/professions', ActionController.createProfession);
// Оценка профессий
router.post('/profession_rating', ActionController.saveProfessionsRating);

// Тесты
// Тест на реакцию
router.post('/test_visual_signal', ActionController.testVisualSignal);
// Тест на цвета
router.post('/test_color_signal', ActionController.testColorSignal);
// Тест на звук
router.post('/test_digital_signal', ActionController.testDigitalSignal);
// Тест на реакцию(шарик)
router.post('/test_simple_rdo', ActionController.testSimpleRdo);
// Тест на реакцию(шарик)
router.post('/test_complex_rdo', ActionController.testComplexRdo);
// Тест на volume
router.post('/test_sound', ActionController.testVisualSignal);

// router.get('/user/:id', UserController.getOneUser);
// router.get('/user', UserController.getUsers);
// router.post('/user', UserController.createUser);
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);

module.exports = router;