let app = new (require('express').Router)();
const models = require("../models");
var moment = require('moment');


app.get('/api/people', function(req,res,next)
{
//  if(!req.user) return res.json({error: 'Not Authorized'});

  models.People.find({}).then((p)=>{
    res.json(p);
  }).catch(next);
});

app.post('/api/people', function(req, res, next)
{
  //if(!req.user) return res.redirect('/login');
  let people = new models.People(req.body);
  people.save()
    .then(()=>{
      res.json(people);
    }).catch(next);
});

app.get('/api/people/:id',(req, res, next)=>{
  //if(!req.user) return res.redirect('/login');
  models.People.findOne({
    _id:req.params.id
  }).exec().then((p)=>{
    if(!p) res.json({});
    models.People.find({room: p.room}, (result) => {
      p.friends = result;
      res.json(p);
    });
  }).catch(next);
});

app.post('/api/people/:id/rate', (req, res, next) => {
  //if(!req.user) return res.redirect('/login');
  if(!req.body) return res.sendStatus(400);
  var id = req.params.id; // получаем id
  var rate = req.body.rate;

  models.People.findOneAndUpdate({_id: id}, {rate: rate}, {new: true} ,(t, data) => {
    res.json(data);
  }).catch(next);
});

app.post('/api/people/:id/note', (req, res, next) => {
  //if(!req.user) return res.redirect('/login');
  if(!req.body) return res.sendStatus(400);
  var id = req.params.id; // получаем id
  var noteText = req.body.note;

  var note = {
    text: noteText,
    date: `${moment().format("DD.MM.YYYY")}`
  };

  models.People.findOne({_id: id}, (t,result) => {
    const p = result.addNote(result, note);
    p.then((data) => {
      res.json(data);
    });
  }).catch(next);
});

module.exports = app;
