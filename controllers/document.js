let app = new (require('express').Router)();
const models = require("../models");

app.post('/api/document', function(req, res, next)
{
  //if(!req.user) return res.redirect('/login');
  let doc = new models.Document(req.body);
  doc.save()
    .then(()=>{
      res.json(doc);
    }).catch(next);
});

app.get('/api/document', function(req,res,next)
{
//  if(!req.user) return res.json({error: 'Not Authorized'});

  models.Document.find({public: true}).then((p)=>{
    res.json(p);
  }).catch(next);
});

module.exports = app;

