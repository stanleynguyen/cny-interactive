const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.load();

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./views/public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.DB);
const Wish = require('./models/wish');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log('Wish Portal Running At', process.env.PORT);
});
