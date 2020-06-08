/* eslint-disable vars-on-top */
const Visitor = require('./../model/vsitorModel');
const Email = require('./../utils/email');
const TimeFormat = require('./../utils/DateTimeFormat');
const BookingTimeFormat = require('./../utils/EmailTimeformat');

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
    // configuring the exact time when the vistor books create the appointment
    // -------------------------------------------------------
    const time = new TimeFormat(visitors).createExactTime();
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

    // configuring the exact time when the vistor books create the appointment
    // -------------------------------------------------------
    const time = new TimeFormat(visitors).createExactTime();
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

  console.log(new BookingTimeFormat(req.body.date, req.body.time).createDate());
  const { bookDate, bookTime } = new BookingTimeFormat(
    req.body.date,
    req.body.time
  ).createDate();
  console.log(bookDate);
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
