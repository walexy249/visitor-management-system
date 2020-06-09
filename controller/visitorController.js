const Visitor = require('./../model/vsitorModel');

// --------------------------------------------------
// controller for creating an appointment
// ---------------------------------------------------
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

// --------------------------------------------------
// controller for displaying the home page
// ---------------------------------------------------
exports.getIndexPage = (req, res, next) => {
  res.render('index');
};
