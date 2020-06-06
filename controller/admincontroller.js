const date = require('date-and-time');
const Visitor = require('./../model/vsitorModel');

exports.getAllAppointmentPage = async (req, res, next) => {
  const visitors = await Visitor.find().sort({ date: -1 });

  const pattern = date.compile('MMM D');
  const now = new Date();
  const today = date.format(now, pattern).split(' ')[1];
  // console.log(today);

  const time = [];

  visitors.forEach(element => {
    if (today === date.format(element.date, pattern).split(' ')[1]) {
      time.push(date.format(element.date, 'hh:mm A', true));
    } else {
      time.push(date.format(element.date, pattern));
    }
  });

  res.render('all-appointment', {
    pageTitle: 'All appointment',
    visitors: visitors,
    time: time
  });
};

exports.pendingAppointmentPage = async (req, res, next) => {
  const visitors = await Visitor.find({ status: 'pending' });

  const pattern = date.compile('MMM D');
  const now = new Date();
  const today = date.format(now, pattern).split(' ')[1];
  // console.log(today);

  const time = [];

  visitors.forEach(element => {
    if (today === date.format(element.date, pattern).split(' ')[1]) {
      time.push(date.format(element.date, 'hh:mm A', true));
    } else {
      time.push(date.format(element.date, pattern));
    }
  });

  res.render('all-appointment', {
    pageTitle: 'pending',
    visitors,
    time
  });
};

exports.appointmentDetailsPage = async (req, res, next) => {
  console.log(req.params.id);
  const visitor = await Visitor.findById({ _id: req.params.id });

  // console.log(visitor);
  res.render('details', {
    pageTitle: 'Details',
    visitor
  });
};

exports.DeclineAppointment = async (req, res, next) => {
  const visitor = await Visitor.findById({ _id: req.body.id });
  visitor.status = 'declined';
  await visitor.save();
  res.redirect(`/admin/all-appointment/${visitor.id}`);
};

exports.DeclineAppointmentPage = async (req, res, next) => {
  const visitors = await Visitor.find({ status: 'decline' });
  const pattern = date.compile('MMM D');
  const now = new Date();
  const today = date.format(now, pattern).split(' ')[1];
  // console.log(today);

  const time = [];

  visitors.forEach(element => {
    if (today === date.format(element.date, pattern).split(' ')[1]) {
      time.push(date.format(element.date, 'hh:mm A', true));
    } else {
      time.push(date.format(element.date, pattern));
    }
  });

  res.render('all-appointment', {
    pageTitle: 'pending',
    visitors,
    time
  });
};

exports.bookAppointment = (req, res, next) => {
  console.log(req.body);
  res.redirect('/admin/all-appointment');
};
