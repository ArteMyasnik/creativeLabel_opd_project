const Router = require('express');
const router = new Router();
const ActionController = require('./actionController');
const UserController = require("../userController");

router.get('/backend/registration', UserController.login);
router.get('/backend/login', UserController.login);
router.get('/backend/main_page', UserController.login);

module.exports = router;