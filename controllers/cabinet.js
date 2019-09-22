let app = new (require("express")).Router();
let models = require("../models");
const model = require("../models");
const moment = require("moment");

app.get("/cabinet/", function(req, res, next) {
  if (!req.user) return res.redirect("/");
  if (!req.user.room) return res.redirect("/cabinet/setroom");
  if (!req.user.people) return res.redirect("/cabinet/setpeople");
  if (req.user.room.length === 0) return res.redirect("/cabinet/setroom");
  models.Room.findById(req.user.room).then(room => {
    models.Floor.findOne({ rooms: req.user.room }).then(floor => {
      let arr = [];
      arr.push(...Object.keys(room.sanitation));
      arr.sort(function(left, right) {
        return moment
          .utc(left, "DD.MM.YYYY")
          .diff(moment.utc(right, "DD.MM.YYYY"));
      });
      let score = [];
      arr.forEach(k => {
        score.push({
          date: k,
          score: room.sanitation[k]
        });
      });
      room.sanitation = score;

      console.log(room);
      res.render("cabinet/index", {
        user: req.user,
        floor: floor,
        room: room
      });
    });
  });
  /*models.Floor.populate(models.Room).findOrCreate({floor: req.user.room[0]}, {
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
      }); */
});

app.get("/cabinet/setroom", function(req, res, next) {
  if (!req.user) return res.redirect("/");
  if (req.user.room) return res.redirect("../cabinet");

  res.render("cabinet/setroom", {
    user: req.user
  });
});

app.get("/cabinet/setpeople", function(req, res, next) {
  if (!req.user) return res.redirect("/");
  if (req.user.people) return res.redirect("../cabinet");

  res.render("cabinet/setpeople", {
    user: req.user
  });
});

app.post("/cabinet/setroom", function(req, res, next) {
  if (!req.user) return res.redirect("/");
  if (req.user.room) return res.redirect("../cabinet");
  if (!req.body.room) return res.redirect("../cabinet/setroom");

  models.Floor.findOrCreate(
    { floor: req.body.room[0] },
    {
      floor: req.body.room[0],
      message: "¯ _ (ツ) _ / ¯",
      news: [],
      rooms: []
    }
  ).then(floorDoc => {
    //Если нет комнаты - создаем
    models.Room.findOrCreate(
      { room: req.body.room },
      { room: req.body.room }
    ).then(roomDoc => {
      if (!floorDoc.doc.rooms.find(rnp => rnp._id.equals(roomDoc.doc._id))) {
        floorDoc.doc.rooms.push(roomDoc.doc);
      }
      floorDoc.doc.save().then(floor => {
        models.User.findOneAndUpdate(
          { vkId: req.user.vkId },
          { room: roomDoc.doc._id }
        ).then(d => {
          var user = d;
          req.login(user, function(error) {
            if (!error) {
              console.log("succcessfully updated user");
            }
          });
          res.redirect("../cabinet");
          res.end(); // important to update session
        });
      });
    });
  });
});

app.post("/cabinet/setpeople", function(req, res, next) {
  if (!req.user) return res.redirect("/");
  if (req.user.people) return res.redirect("../cabinet");
  if (!req.body.firstName || !req.body.name) return res.redirect("../cabinet/setpeople");


  models.People.find({room: req.user.room})
    .then(p => {
      let filtered = p
        .filter(people => people.name.includes(req.body.firstName));
      if (filtered.length > 1) {
        filtered = filtered.filter(people => people.name.includes(req.body.name));
      }
      if (filtered.length === 0) {
        return null;
      }
      return filtered[0];
    })
    .then(p => {
      if (p === null) {
        const v = {
          name: `${req.body.firstName} ${req.body.name}`,
          room: req.user.room
        };
        let people = new models.People(v);
        return people.save();
      }
      return p;
    })
    .then(p => {
      return model.User.findOneAndUpdate({_id: req.user._id}, {people: p})
    })
    .then(u => (res.redirect("../cabinet")));
});


module.exports = app;
