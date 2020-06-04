exports.getLoginPage = (req, res, next) => {
  res.render('login', {
    pageTitle: 'Login'
  });
};

exports.createNewUser = (req, res, next) => {};
