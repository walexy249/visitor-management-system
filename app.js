const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const visitorRoute = require('./routes/visitorRoute');

const adminRoute = require('./routes/adminRoute');

const app = express();

// set the bodyparser

app.use(bodyParser.urlencoded({ extended: true }));

// configuring the template engine to Ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(visitorRoute);
app.use('/admin', adminRoute);

app.use((req, res, next) => {
  res.send('<h1>Page not found</h1>');
});

mongoose.connect('mongodb://localhost:27017/Pheity').then(() => {
  console.log('Database connection successful');
});
app.listen(3000, () => {
  console.log('app started on port 3000');
});
