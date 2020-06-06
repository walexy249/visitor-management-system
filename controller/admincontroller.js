const date = require('date-and-time');
const Visitor = require('./../model/vsitorModel');

exports.getAllAppointmentPage = async (req, res, next) => {
  const visitors = await Visitor.find();

  // const visitor = await Visitor.findOne({ email: 'lawalolawale32@gmail.com' });
  // console.log(visitor);
  // const pattern = date.compile('MMM D');
  // const day = date.format(visitor.date, pattern).split(' ')[1];
  // console.log(day);

  // const time = date.format(visitor.date, 'hh:mm A [GMT]Z', true);
  // const now = new Date();
  // const time = date.subtract(now, visitor.date).toHours();

  // console.log(time);

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
  console.log(visitors.length);

  res.render('all-appointment', {
    pageTitle: 'All appointment',
    visitors: visitors,
    time: time
  });
};
