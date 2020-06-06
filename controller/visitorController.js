const Visitor = require('./../model/vsitorModel');

exports.submitAppointment = async (req, res, next) => {
  await Visitor.create({
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    purpose: req.body.purpose
  });
  console.log('appointed created successful');
  res.redirect('/');
};

exports.getIndexPage = (req, res, next) => {
  res.render('index');
};
