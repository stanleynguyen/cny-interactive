const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const auth = require('http-auth');
const basic = auth.basic({ realm: 'CNY Interactive Admin' }, (admin, password, done) => {
  done(admin === process.env.ADMIN && password === process.env.PASSWORD);
});

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.load();
}

const app = express();
app.use(helmet());
app.use(auth.connect(basic));
app.set('view engine', 'ejs');
app.use(express.static('./views/public'));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect(process.env.DB);
mongoose.Promise = global.Promise;

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/admin', (req, res) => {
  res.render('admin');
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

app.get('/api/wishes/filtered', (req, res) => {
  mongoose.connection.db.collection('wishes', (err, collection) => {
    if (err) return res.status(500).send('Database Error');
    collection.find({filtered: true}).toArray((err, docs) => {
      if (err) return res.status(500).send('Database Error');
      res.json(docs);
    });
  });
});

app.post('/api/wishes', (req, res) => {
  mongoose.connection.db.collection('wishes', (err, collection) => {
    if (err) return res.status(500).send('Database Error');
    collection.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.body.id) },
      {
        $set: { filtered: true }
      },
      (err) => {
        if (err) return res.status(500).send('Database Error');
        res.status(200).send('Success');
      }
    );
  });
});

app.delete('/api/wishes', (req, res) => {
  mongoose.connection.db.collection('wishes', (err, collection) => {
    if (err) return res.status(500).send('Database Error');
    collection.findOneAndDelete(
      { _id: mongoose.Types.ObjectId(req.body.id) },
      (err) => {
        if (err) return res.status(500).send('Database Error');
        res.status(200).send('Success');
      }
    );
  });
});

app.listen(process.env.PORT, err => {
  if (err) throw err;
  console.log('Display Server Running At', process.env.PORT);
});
