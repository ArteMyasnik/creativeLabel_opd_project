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
router.put('/experts', UserController.assignExperts)
// Сброс эксперта
router.post('/experts/reset', UserController.resetExperts);
// Сброс эксперта
// router.post('/profession_rating', UserController.saveProfessionsRating);


// Тесты
// Тест на реакцию
router.post('/test_visual_signal', UserController.testVisualSignal);
// Тест на цвета
router.post('/test_color_signal', UserController.testColorSignal);
// Тест на звук
router.post('/test_digital_signal', UserController.testDigitalSignal);
// Тест на реакцию(шарик)
router.post('/test_simple_rdo', UserController.testSimpleRdo);
// Тест на реакцию(шарик)
router.post('/test_complex_rdo', UserController.testComplexRdo);

// router.get('/user/:id', UserController.getOneUser);
// router.get('/user', UserController.getUsers);
// router.post('/user', UserController.createUser);
// router.put('/user/:id', UserController.updateUser);
// router.delete('/user/:id', UserController.deleteUser);

module.exports = router;