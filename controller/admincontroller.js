/* eslint-disable vars-on-top */
const Visitor = require('./../model/vsitorModel');
const Email = require('./../utils/email');
const TimeFormat = require('./../utils/DateTimeFormat');
const BookingTimeFormat = require('./../utils/EmailTimeformat');

// --------------------------------------------------------
// This controller performs many functions
//  Displays all the appointment results
//  Displays details about a specific appointment by passing an id parameter
//  Display all appointment based on the status i.e pending , approved , declined
//  paginate all the results
// controller for approving book appointment and sending booking appointment approved email to client
// --------------------------------------------------------
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

  // Displays all the appointment
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
    // configuring the exact time when the vistor books create the appointment in 08:00 pm or july 10
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
    // Displays the categories of appoinment based on status
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

// --------------------------------------------------------
//controller for showing the details of each appointment
// --------------------------------------------------------
exports.appointmentDetailsPage = async (req, res, next) => {
  // console.log(req.params.id);
  const visitor = await Visitor.findById({ _id: req.params.id });

  // console.log(visitor);
  res.render('details', {
    pageTitle: 'Details',
    visitor
  });
};

// --------------------------------------------------------
//Decline appointment and send email to client booking appointment approved email to client
// --------------------------------------------------------
exports.declineAppointment = async (req, res, next) => {
  const visitor = await Visitor.findById({ _id: req.body.id });
  // send the email to the client by using the Email
  try {
    await new Email(visitor, {}).declineAppointment();
    visitor.status = 'declined';
    await visitor.save();
  } catch (err) {
    console.log(err);
  }
};

// --------------------------------------------------------
// controller for approving book appointment and sending booking appointment approved email to client
// --------------------------------------------------------
exports.bookAppointment = async (req, res, next) => {
  const visitor = await Visitor.findById({ _id: req.body.id });
  // configure the appoinment date and time from the BookingTimeFormat class
  // console.log(new BookingTimeFormat(req.body.date, req.body.time).createDate());
  const { bookDate, bookTime } = new BookingTimeFormat(
    req.body.date,
    req.body.time
  ).createDate();
  console.log(bookDate);
  console.log(bookTime);
  // send the email to the client by using the Email
  try {
    await new Email(visitor, { bookDate, bookTime }).approveAppointment();
    visitor.status = 'approved';
    visitor.save();
  } catch (err) {
    console.log(err);
  }

  res.redirect(`/admin/appointment/${req.body.id}`);
};

// --------------------------------------------------------
// controller for displaying search result based on the name in the search box
// --------------------------------------------------------
exports.searchResult = async (req, res, next) => {
  // eslint-disable-next-line no-var
  var ItemsPerPage = 2;
  // eslint-disable-next-line no-var
  var page;
  const { search } = req.body;
  const totalNumberOfDocument = await Visitor.find({
    name: search
  }).countDocuments();
  // math.ceil rounds the  total number of pages to the nearest integer
  const totalNumberOfPage = Math.ceil(totalNumberOfDocument / ItemsPerPage);
  const searchResults = await Visitor.find({
    name: search
  });
  const time = new TimeFormat(searchResults).createExactTime();
  // console.log(searchResults);

  // the all properties means all categories
  res.render('searchResult', {
    pageTitle: 'All appointment',
    visitors: searchResults,
    time: time,
    currentPage: page,
    lastPage: totalNumberOfPage,
    all: true
  });
};
