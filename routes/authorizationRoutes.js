var express = require('express');
var router = express.Router();
var authController = require('../controllers/authorizationControllers');
var helper = require('../helpers/helper');

// login
router.get (
    `/login`,
    authController.login,
)

// get user list
router.get (
    `/userList`,
    helper.authorize,
    authController.getAllUsers,
)

// refresh token
router.post(
    `/refreshToken`,
    authController.refreshToken
)

// logout
router.post(
    '/logout/:user_id',
    authController.logout
)

module.exports = router;
