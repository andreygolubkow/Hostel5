let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");

app.get("/api/search/notes/query", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  if (!req.query.q) return res.json([]);

  models.RoomNote.where({ text: req.query.q })
    .exec()
    .then(d => res.json(d));
});

app.get("/api/search/notes/lastweek", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  // Ищем заметки со среды, т.к. собрания по вторникам
  const weekday = 3;

  var tuesday = moment()
    .utc()
    .day(+weekday);

  if (tuesday.dayOfYear() > moment().dayOfYear()) {
    tuesday = tuesday.subtract(7, "days");
  }
  tuesday = tuesday.set({ hours: 14, minute: 0, millisecond: 0 });
  models.RoomNote.find({ createdAt: { $gt: tuesday.format() } })
    .populate("room")
    .then(result => res.json(result))
    .catch(next);
});

app.get("/api/search/notes/lastmonth", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  var tuesday = moment()
    .utc()
    .subtract(1, "month");

  models.RoomNote.find({ createdAt: { $gt: tuesday.format() } })
    .then(result => res.json(result))
    .catch(next);
});

app.get("/api/search/people/notes/lastmonth", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  var month = moment()
    .utc()
    .subtract(1, "month");

  models.People.find({ updatedAt: { $gt: month.format() } })
    .then(result => res.json(result))
    .catch(next);
});

app.get("/api/search/people/", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  if (!req.query.q) return res.json([]);
  const q = req.query.q;
  if (q.length < 3) return res.json([]);

  models.People.find({ name: { $regex: `.*${q}.*` } })
    .then(result => res.json(result))
    .catch(next);
});

app.get("/api/search/rooms/bad", (req, res, next) => {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (!req.user.admin && !req.user.sanitary) return res.json([]);

  let filter = {};

  models.Room.find({})
    .then(result => {
      const bad = result
        .filter(r => r.sanitation && Object.keys(r.sanitation).length >1)
        .filter(r => {
          const len =  Object.keys(r.sanitation).length;
          const key = Object.keys(r.sanitation)[len-1];
          return r.sanitation[key] < 4
        })
        .filter(r => {
          const len =  Object.keys(r.sanitation).length;
          const key = Object.keys(r.sanitation)[len-2];
          return r.sanitation[key] < 4
        });
      res.json(bad);
    })
    .catch(next);
});

module.exports = app;
