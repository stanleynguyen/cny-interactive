const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');

dotenv.load();

const app = express();
app.use(helmet());
app.set('view engine', 'ejs');
app.use(express.static('./views/public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.DB);
mongoose.Promise = global.Promise;

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/api/wishes/all', (req, res) => {
  mongoose.connection.db.collection('wishes', (err, collection) => {
    if (err) return res.status(500).send('Database Error');
    collection.find({}).toArray((err, docs) => {
      if (err) return res.status(500).send('Database Error');
      res.json(docs);
    });
  });
});

app.get('/api/wishes/unfiltered', (req, res) => {
  mongoose.connection.db.collection('wishes', (err, collection) => {
    if (err) return res.status(500).send('Database Error');
    collection.find({filtered: false}).toArray((err, docs) => {
      if (err) return res.status(500).send('Database Error');
      res.json(docs);
    });
  });
});

app.get('api/wishes/filtered', (req, res) => {
  mongoose.connection.db.collection('wishes', (err, collection) => {
    if (err) return res.status(500).send('Database Error');
    collection.find({filtered: true}).toArray((err, docs) => {
      if (err) return res.status(500).send('Database Error');
      res.json(docs);
    });
  });
});

app.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log('Display Server Running At', process.env.PORT);
});
