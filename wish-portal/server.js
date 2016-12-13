const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const xss = require('xss');
const ddos = new (require('ddos'))();

dotenv.load();

const app = express();
app.use(ddos.express);
app.use(helmet());
app.set('view engine', 'ejs');
app.use(express.static('./views/public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.DB);
mongoose.Promise = global.Promise;
const Wish = require('./models/wish');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  let { content, author } = req.body;
  content = xss(content);
  author = xss(author);
  let time = Date.now();
  let filtered = false;
  let newWish = new Wish({ content, author, time, filtered });
  newWish.save((err) => {
    if (err) return res.status(500).send('Failed to save to database');
    res.status(200).send('Successfully sent wish');
  });
});

app.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log('Wish Portal Running At', process.env.PORT);
});
