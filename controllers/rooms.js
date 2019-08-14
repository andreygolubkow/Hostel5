let app = new (require('express').Router)();
const models = require("../models");
var moment = require('moment');
var XLSX = require('xlsx');
const formidable = require('formidable');

app.get('/api/room', function(req,res,next)
{
//  if(!req.user) return res.json({error: 'Not Authorized'});
  models.People.aggregate([{$group: {
      _id: "$room",
      peoples: { $push: {
          faculty: "$faculty",
          citizen: "$citizen"
        } }
    }}])
    .exec().then((d) => (res.json(d)));
});

app.get('/api/room/:room',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');
  models.People
    .where({room: req.params.room})
    .exec().then((d) => (res.json({
      room: req.params.room,
      peoples: d
  })));
});

module.exports = app;

