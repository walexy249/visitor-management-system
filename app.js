const express = require('express');

const app = express();

// app.use((req, res, next) => {
//   res.send('<h1>welcome page</h1>');
// });

// configuring the template engine to Ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

app.listen(3000, () => {
  console.log('app started on port 3000');
});
