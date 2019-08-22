let app = new (require('express').Router)();
let models = require('../models');

app.get('/cabinet/',function(req,res,next)
{
  if(!req.user) return res.redirect('/');
  if(!req.user.room) return res.redirect('/cabinet/setroom');
  if(req.user.room.length === 0) return res.redirect('/cabinet/setroom');

  models.Floor.findOrCreate({floor: req.user.room[0]}, {
    floor: req.user.room[0],
    message: "¯ _ (ツ) _ / ¯",
    news: []
  }).then(f => {
    models.Room.findOrCreate({room: req.user.room}, {
      room: req.user.room,
      sanitation: []
    }).then(r => (
      res.render('cabinet/index', {
        user: req.user,
        floor: f.doc,
        room: r.doc,
        getScoreClass: function() {
          return function(san, render) {
            switch (san.score) {
              case 1:
                return `<span class=\"label label-success\">${san.date}</span>`;
              case 2:
                return `<span class=\"label label-success\">${san.date}</span>`;
              case 3:
                return `<span class=\"label label-success\">${san.date}</span>`;
              case 4:
                return `<span class=\"label label-success\">${san.date}</span>`;
              case 5:
                return `<span class=\"label label-success\">${san.date}</span>`;
              default:
                return `<span class=\"label label-success\">${san.date}</span>`;
            }
          }
        }
    })
    ));
  });
});

app.get('/cabinet/',function(req,res,next)
{
  if(!req.user) return res.redirect('/');

  res.render('cabinet/index', {
    user: req.user
  });
});

app.get('/cabinet/setroom',function(req,res,next)
{
  if(!req.user) return res.redirect('/');
  if(req.user.room) return res.redirect('../cabinet');

  res.render('cabinet/setroom', {
    user: req.user
  });
});

app.post('/cabinet/setroom',function(req,res,next)
{
  if(!req.user) return res.redirect('/');
  if(req.user.room) return res.redirect('../cabinet');
  if(!req.body.room) return res.redirect('../cabinet/setroom');


  models.User.findOneAndUpdate({vkId: req.user.vkId}, {room: req.body.room})
    .then((d) => {

      var user = d;
      req.login(user, function(error) {
        if (!error) {
          console.log('succcessfully updated user');
        }
      });
      res.redirect('../cabinet');
      res.end(); // important to update session
    });
});


module.exports = app;