/* eslint-disable vars-on-top */
const date = require('date-and-time');

const Visitor = require('./../model/vsitorModel');
const Email = require('./../utils/email');

exports.getAllAppointmentPage = async (req, res, next) => {
  // eslint-disable-next-line no-var
  var ItemsPerPage = 2;
  // eslint-disable-next-line no-var
  var page;
  if (!req.query.page) {
    page = 1;
  } else {
    page = +req.query.page;
  }
  if (!req.query.status) {
    const totalNumberOfDocument = await Visitor.find().countDocuments();
    const totalNumberOfPage = Math.ceil(totalNumberOfDocument / ItemsPerPage);
    console.log('------------------------');
    console.log(`page : ${page}`);
    console.log(`total number of page : ${totalNumberOfPage}`);
    console.log('------------------------');
    const visitors = await Visitor.find()
      .skip((page - 1) * ItemsPerPage)
      .limit(ItemsPerPage)
      .sort({ date: -1 });
    // configuring the exact time when the vistor books the appointment
    // -------------------------------------------------------
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
    // -------------------------------------------------------

    res.render('all-appointment', {
      pageTitle: 'All appointment',
      visitors: visitors,
      time: time,
      currentPage: page,
      lastPage: totalNumberOfPage,
      all: true
    });
  } else {
    const totalNumberOfDocument = await Visitor.find({
      status: req.query.status
    }).countDocuments();
    const totalNumberOfPage = Math.ceil(totalNumberOfDocument / ItemsPerPage);
    console.log('------------------------');
    console.log(`page : ${page}`);
    console.log(`total number of page : ${totalNumberOfPage}`);
    console.log('------------------------');
    const visitors = await Visitor.find({ status: req.query.status })
      .skip((page - 1) * ItemsPerPage)
      .limit(ItemsPerPage)
      .sort({
        date: -1
      });

    // configuring the exact time when the vistor books the appointment
    // -------------------------------------------------------
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
    // --------------------------------------------------------
    res.render('all-appointment', {
      pageTitle: 'All appointment',
      visitors: visitors,
      time: time,
      lastPage: totalNumberOfPage,
      currentPage: page,
      all: false
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
