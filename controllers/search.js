let app = new (require('express').Router)();
const models = require("../models");
var moment = require('moment');
var XLSX = require('xlsx');
const formidable = require('formidable');

// Нужен параметр q
app.get('/api/search/notes/query',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');
  if (!req.query.q) return res.json([]);

  models.RoomNote
    .where({text: req.query.q})
    .exec().then((d) => (res.json(d)));
});

app.get('/api/search/notes/lastweek',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');

  // Ищем заметки со среды, т.к. собрания по вторникам
  const weekday = 3;

  var tuesday = moment().utc().day(+weekday);

  if (tuesday.dayOfYear() > moment().dayOfYear()) {
    tuesday = tuesday.subtract(7, 'days');
  }
  tuesday = tuesday.set({hours: 14, minute: 0, millisecond: 0});
  models.RoomNote
    .find({ createdAt: {$gt: tuesday.format()}})
    .then((result) => (res.json(result)))
    .catch(next);
});

app.get('/api/search/notes/lastmonth',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');

  var tuesday = moment().utc().subtract(1, 'month');

  models.RoomNote
    .find({ createdAt: {$gt: tuesday.format()}})
    .then((result) => (res.json(result)))
    .catch(next);
});

app.get('/api/search/people/notes/lastmonth',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');

  var month = moment().utc().subtract(1, 'month');

  models.People
    .find({ updatedAt: {$gt: month.format()}})
    .then((result) => (res.json(result)))
    .catch(next);
});

app.get('/api/search/people/',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');
  if (!req.query.q) return res.json([]);
  const q = req.query.q;
  if (q.length <3 ) return res.json([]);

  models.People
    .find({ name: {$regex : `.*${q}.*`}})
    .then((result) => (res.json(result)))
    .catch(next);
});



module.exports = app;

