const express = require('express');
const authcontroller = require('./../controller/authController');

const router = express.Router();

router.route('/login').get(authcontroller.getLoginPage);

module.exports = router;
