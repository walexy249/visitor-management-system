const date = require('date-and-time');

const Visitor = require('./../model/vsitorModel');
const Email = require('./../utils/email');

exports.getAllAppointmentPage = async (req, res, next) => {
  // console.log(req.query);
  if (!req.query.status) {
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
  } else {
    const visitors = await Visitor.find({ status: req.query.status }).sort({
      date: -1
    });

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
  }
};

exports.appointmentDetailsPage = async (req, res, next) => {
  // console.log(req.params.id);
  const visitor = await Visitor.findById({ _id: req.params.id });

  // console.log(visitor);
  res.render('details', {
    pageTitle: 'Details',
    visitor
  });
};

exports.declineAppointment = async (req, res, next) => {
  const visitor = await Visitor.findById({ _id: req.body.id });
  try {
    await new Email(visitor, {}).declineAppointment();
    visitor.status = 'declined';
    await visitor.save();
  } catch (err) {
    console.log(err);
  }

  res.redirect(`/admin/appointment/${visitor.id}`);
};

exports.bookAppointment = async (req, res, next) => {
  const visitor = await Visitor.findById({ _id: req.body.id });

  // request a weekday along with a long date
  const dates = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const bookDate = dates.toLocaleDateString('de-DE', options);
  console.log(bookDate);
  const t1 = req.body.time.split(':')[0];
  const t2 = req.body.time.split(':')[1];
  // console.log(t1, t2);
  const booktimeFormat = (a, b) => {
    if (a > 12) {
      return `${a - 12}:${b} PM`;
    }
    return `${a.split('')[1]}:${b} AM`;
  };
  const bookTime = booktimeFormat(t1, t2);
  console.log(bookTime);

  try {
    await new Email(visitor, { bookDate, bookTime }).approveAppointment();
    visitor.status = 'approved';
    visitor.save();
  } catch (err) {
    console.log(err);
  }

  res.redirect(`/admin/appointment/${req.body.id}`);
};
