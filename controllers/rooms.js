let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");

app.get("/api/room", function(req, res, next) {
  if (!req.user && !config.skipAuth) return res.json([]);

  if (req.user.admin) {
    return  models.Room.find({}).then(r => {
      r.sort(function compareFunction( a, b ) {
        const r1 = Number.parseFloat(a.room);
        const r2 = Number.parseFloat(b.room);
        if ( r1<r2) {
          return -1;
        }
        if ( r1>r2) {
          return 1;
        }
        return 0;
      });
      return res.json(r);
    });
  }

  if (req.user.sanitary) {
    models.User.findById(req.user._id)
      .populate({
        path:"sanitary.floors",
        model: "Floor",
        populate: {
          path:"rooms",
          model: "Room"
        }
      })
      .then(f => {
        if (!f) return res.json([]);
        var mapped = f.sanitary.floors.map(fl => fl.rooms);

        const arr = [];

        mapped.forEach((a, b, c) => {
          arr.push(...mapped);
        });
        res.json(arr);
      });
  }
});

app.get("/api/room/:room", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  models.Room.findById(req.params.room)
    .then(r => {
      return models.People.find({room: {$eq: r._id}})
        .then(p => {
          var room = Object.assign({
            peoples: p
          }, r._doc);
          return room;
        });
    })
    .then(r => (res.json(r)));
});

app.get("/api/room/:room/note", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  models.RoomNote.find({ room: { $eq: req.params.room } })
    .sort({ createdAt: -1 })
    .exec()
    .then(d => res.json(d));
});

app.post("/api/room/:room/note", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  let note = new models.RoomNote({
    text: req.body.text,
    room: req.params.room,
    level: req.body.level,
    date: `${moment().format("DD.MM.YYYY")}`
  });

  note
    .save()
    .then(() => {
      res.json(note);
    })
    .catch(next);
});

app.post("/api/room/:room/score", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  models.Room.findById(req.params.room)
    .then(room => {
      const san = room.sanitation ? room.sanitation : {};
      san[req.body.date] = req.body.score;

      models.Room.findOneAndUpdate(
        { _id: room._id },
        { sanitation: san },
        { new: true }
      ).then(room => {
        res.json(room);
      });
    })
    .catch(next);
});

module.exports = app;
