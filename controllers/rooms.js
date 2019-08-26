let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");

app.get("/api/room", function(req, res, next) {
  if (!req.user && !config.skipAuth) return res.json([]);
  /*models.People.aggregate([
    {
      $group: {
        _id: "$room",
        peoples: {
          $push: {
            faculty: "$faculty",
            citizen: "$citizen"
          }
        }
      }
    }
  ])
    .exec()
    .then(d => res.json(d));
*/
  if (req.user.admin) {
    models.Room.find({}).then(r => res.json(r));
  }

  if (req.user.sanitary) {
    models.User.findById(req.user._id)
      .populate("sanitary.floors")
      .then(f => {
        const mapped = f.map(fl => fl.rooms);

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

  models.Room.findById(req.params.room).then(r => res.json(r));

  /*
  models.People.where({ room: req.params.room })
    .exec()
    .then(d =>
      res.json({
        room: req.params.room,
        peoples: d
      })
    );
   */
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
      const san = room.sanitation;
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
