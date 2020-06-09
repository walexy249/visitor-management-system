const express = require('express');
const { body } = require('express-validator/check');

const User = require('./../model/userModel');

const authController = require('./../controller/authController');
const adminController = require('./../controller/adminController');

const router = express.Router();

router
  .route('/login')
  .get(authController.getLoginPage)
  .post(authController.Login);

router
  .route('/create-new-user')
  .get(authController.createNewUserPage)
  .post(
    [
      body('name')
        .isLength({ min: 5 })
        .withMessage('fullname must be more than 5 chracters')
        .trim(),
      body('email')
        .isEmail()
        .custom(async (value, { req }) => {
          const user = await User.findOne({ email: req.body.email });
          if (user) {
            return Promise.reject(new Error('Email already exist'));
          }
        }),
      body('password')
        .isLength({ min: 5 })
        .withMessage('password must be more at least 5 characters long'),
      body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('password must match');
        } else {
          return true;
        }
      })
    ],
    authController.createUser
  );

router.route('/appointment').get(adminController.getAllAppointmentPage);
router.route('/book-appointment').post(adminController.bookAppointment);
router.route('/decline-appointment').post(adminController.declineAppointment);

router.route('/appointment/:id').get(adminController.appointmentDetailsPage);
router.route('/search').post(adminController.searchResult);

module.exports = router;
