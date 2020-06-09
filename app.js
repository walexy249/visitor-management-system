const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, 'config.env')
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const visitorRoute = require('./routes/visitorRoute');

const adminRoute = require('./routes/adminRoute');

const app = express();

// app.use((req, res, next) => {
//   console.log(path.join(__dirname, 'config.env'));
//   next();
// });

// ---------------------------------
// set bodyParser for storing requeest body
// --------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));

// ---------------------------------
// configuring the template engine to Ejs and the views to the views folder
// --------------------------------------
app.set('view engine', 'ejs');
app.set('views', 'views');

// ---------------------------------
// configuring the path for requesting files
// --------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------
// configures the Router for each request
// --------------------------------------
app.use(visitorRoute);
app.use('/admin', adminRoute);

// ---------------------------------
// page not found middleware
// --------------------------------------
app.use((req, res, next) => {
  res.send('<h1>Page not found</h1>');
});

// ---------------------------------
// Setup a connection using mongoose to the mongodb database
// --------------------------------------
mongoose.connect('mongodb://localhost:27017/Pheity').then(() => {
  console.log('Database connection successful');
});

// ---------------------------------
// Setup up a port for listening to incomning request
// --------------------------------------
app.listen(3000, () => {
  console.log('app started on port 3000');
});
