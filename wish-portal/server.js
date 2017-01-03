const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const xss = require('xss');
const ddos = new (require('ddos'))();

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.load();
}

const app = express();
app.use(ddos.express);
app.use(helmet());
app.set('view engine', 'ejs');
app.use(express.static('./views/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(function(req, res, next) {
  let allowedOrigins = ["http://cny-interactive.herokuapp.com", "http://chinatownfestivals.sg"];
  let origin = req.headers.origin;
  if(allowedOrigins.indexOf(origin) > -1){
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.connect(process.env.DB);
mongoose.Promise = global.Promise;
const Wish = require('./models/wish');

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', (req, res) => {
  let { content, author } = req.body;
  content = (content.length > 70) ? content.substring(0, 70) : content;
  author = (author.length > 20) ? author.substring(0, 20) : author;
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
