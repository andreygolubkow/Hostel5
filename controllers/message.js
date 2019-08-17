let app = new (require('express').Router)();
const models = require("../models");
var moment = require('moment');
var XLSX = require('xlsx');
const formidable = require('formidable');
const axios = require('axios');
const config = require('../config');

app.post('/api/message', function(req, res, next)
{
  //if(!req.user) return res.redirect('/login');

  axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha}&response=${req.body.recaptcha}`)
    .then((data) => {
      if (data.data.success) {
        let message = new models.Message(req.body.message);
        message.save()
          .then(()=>{
            res.json(message);
          }).catch(next);
      } else {
        res.json({error: "recapcha error"});
      }
  });
});

app.get('/api/message', function(req,res,next)
{
//  if(!req.user) return res.json({error: 'Not Authorized'});

  models.Message.find({public: true}).then((p)=>{
    res.json(p);
  }).catch(next);
});

module.exports = app;

