let app = new (require('express').Router)();
const models = require("../models");
var moment = require('moment');
var XLSX = require('xlsx');
const formidable = require('formidable');

app.get('/api/room', function(req,res,next)
{
  if (req.user.admin) {
    models.People.aggregate([{$group: {
        _id: "$room",
        peoples: { $push: {
            faculty: "$faculty",
            citizen: "$citizen"
          } }
      }}])
      .exec().then((d) => (res.json(d)));
  }
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

app.get('/api/room/:room/note',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');
  models.RoomNote
    .find( { room: { $eq: req.params.room } } )
    .sort( { createdAt: -1 } )
    .exec().then((d) => (res.json(d)));
});

app.post('/api/room/:room/note',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');/

  let note = new models.RoomNote({
    text: req.body.text,
    room: req.params.room,
    level: req.body.level,
    date: `${moment().format("DD.MM.YYYY")}`
  });

  note.save()
    .then(()=>{
      res.json(note);
    }).catch(next);
});



module.exports = app;

