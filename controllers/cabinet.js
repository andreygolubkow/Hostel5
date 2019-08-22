let app = new (require('express').Router)();
let models = require('../models');
const model = require("../models");

app.get('/cabinet/',function(req,res,next)
{
  if(!req.user) return res.redirect('/');
  if(!req.user.room) return res.redirect('/cabinet/setroom');
  if(req.user.room.length === 0) return res.redirect('/cabinet/setroom');




  models.Floor.populate('rooms').findOrCreate({floor: req.user.room[0]}, {
    floor: req.user.room[0],
    message: "¯ _ (ツ) _ / ¯",
    news: [],
    rooms: [
      {
        room: req.user.room,
        sanitation: []
      }
    ],
  }).then((d) =>
    {
      if (!d.doc.rooms.find(r => (r.room === req.user.room))) {
          models.Floor.findOneAndUpdate({floor: req.user.room[0] },{rooms: {$push: {room: req.user.room}}}, {new: true})
            .then((d) => (
              res.render('cabinet/index', {
                user: req.user,
                floor: f.doc,
                room: d.rooms.find(r => (r.room === req.user.room))
                }
            )));
      } else {
        res.render('cabinet/index', {
            user: req.user,
            floor: f.doc,
            room: d.rooms.find(r => (r.room === req.user.room))
          }
        )
      }
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

  models.Room.findOrCreate({room: req.body.room}, {room: req.body.room})
    .then(r => {
      models.User.findOneAndUpdate({vkId: req.user.vkId}, {room: r.doc})
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

});


module.exports = app;
