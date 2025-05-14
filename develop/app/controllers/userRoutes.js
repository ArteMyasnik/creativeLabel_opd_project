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
// Расстановка порядка тестов
router.post('/profession_tests', ActionController.saveProfessionsTestsRating);

// Тесты
// Тест на реакцию
router.post('/test_visual_signal', ActionController.testVisualSignal);
// Тест на звук
router.post('/test_sound_signal', ActionController.testSoundSignal);
// Тест на цвета
router.post('/test_color_signal', ActionController.testColorSignal);
// Тест на сумму визуально
router.post('/test_digital_signal', ActionController.testDigitalSignal);
// Тест на сумму на слух
router.post('/test_audio_sum', ActionController.testAudioSum);
// Тест на реакцию(шарик)
router.post('/test_simple_rdo', ActionController.testSimpleRdo);
// Тест на реакцию(шарик)
router.post('/test_complex_rdo', ActionController.testComplexRdo);
// Тест на аналоговое слежение
router.post('/test_analog_tracking', ActionController.testAnalogTracking);
// Тест на аналоговое преследование
router.post('/test_analog_chase', ActionController.testAnalogChase);


module.exports = router;