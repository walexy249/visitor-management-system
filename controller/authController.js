const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');
const User = require('./../model/userModel');

exports.getLoginPage = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Login'
  });
};

exports.createNewUserPage = (req, res, next) => {
  res.render('create-new-user', {
    pageTitle: 'create user'
  });
};

exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()[0].msg);
    return res.redirect('/admin/create-new-user');
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  console.log(hashedPassword);
  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  });
  res.redirect('/admin/login');
};

exports.Login = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    console.log('please input your email and password');
    return res.redirect('/admin/login');
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    console.log('invalid email');
    return res.redirect('/admin/login');
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    console.log('invalid Password');
    return res.redirect('/admin/login');
  }
  res.redirect('/admin/all-appointment');
};
