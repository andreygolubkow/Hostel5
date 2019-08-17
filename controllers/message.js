let app = new (require('express').Router)();
const models = require("../models");
var moment = require('moment');
var XLSX = require('xlsx');
const formidable = require('formidable');

app.post('/api/message', function(req, res, next)
{
  //if(!req.user) return res.redirect('/login');

  let people = new models.People(req.body);
  people.save()
    .then(()=>{
      res.json(people);
    }).catch(next);
});

module.exports = app;

