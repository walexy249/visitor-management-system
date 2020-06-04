const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// app.use((req, res, next) => {
//   res.send('<h1>welcome page</h1>');
// });
// set the bodyparser

app.use(bodyParser.urlencoded({ extended: false }));

// configuring the template engine to Ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

app.get('/', (req, res, next) => {
  res.render('index');
});

app.use(express.static(path.join(__dirname, 'public')));
app.listen(3000, () => {
  console.log('app started on port 3000');
});
