const date = require('date-and-time');
const Visitor = require('./../model/vsitorModel');

exports.getAllAppointmentPage = async (req, res, next) => {
  const visitors = await Visitor.find().sort({ date: -1 });

  const pattern = date.compile('MMM D');
  const now = new Date();
  const today = date.format(now, pattern).split(' ')[1];
  console.log(today);

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
