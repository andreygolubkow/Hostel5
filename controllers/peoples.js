let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");
const config = require("../config");

app.post("/api/people", function(req, res, next) {
  if (!req.user && !req.user.admin && !config.skipAuth) return res.json([]);

  if (req.query.type === "xlsx") {
    return importPeoples(req, res, next);
  }

  let people = new models.People(req.body);
  people
    .save()
    .then(() => {
      res.json(people);
    })
    .catch(next);
});

function importPeoples(req, res, next) {
  if (!req.user && !req.user.admin && !config.skipAuth) return res.json([]);

  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var f = files[Object.keys(files)[0]];
    var workbook = XLSX.readFile(f.path);
    const json = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
      { header: 0 }
    );
    const peoples = [];
    json.forEach((v, i, a) => {
      models.Room.findOrCreate({ room: v.room }, { room: v.room }).then(
        roomDoc => {
          if (!floorDoc.doc.rooms.find(rnp => r._id.equals(roomDoc.doc._id))) {
            floorDoc.doc.rooms.push(roomDoc.doc);
          }
          floorDoc.doc.save().then(floor => {
            v.room = roomDoc.doc._id;
            let people = new models.People(v);
            people.save();

            if (i === json.length - 1) {
              res.status(200);
            }
          });
        }
      );
    });
  });
  res.status(501);
}

app.get("/api/people", function(req, res, next) {
  if (!req.user && !req.user.admin && !config.skipAuth) return res.json([]);

  models.People.find({})
    .sort({ name: 1 })
    .then(p => {
      res.json(p);
    })
    .catch(next);
});

app.get("/api/people/:id", (req, res, next) => {
  if (!req.user && !req.user.admin && !config.skipAuth) return res.json([]);

  models.People.findOne({
    _id: req.params.id
  })
    .exec()
    .then(p => {
      if (!p) res.json({});
      models.People.find({ room: p.room, _id: { $ne: p._id } }, (t, result) => {
        res.json(Object.assign({ friends: result }, p._doc));
      });
    })
    .catch(next);
});

app.delete("/api/people/:id", (req, res, next) => {
  if (!req.user && !req.user.admin && !config.skipAuth) return res.json([]);

  models.People.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return res.status(500);
  });
  res.status(200);
});

app.post("/api/people/:id/rate", (req, res, next) => {
  if (!req.user && !req.user.admin && !config.skipAuth) return res.json([]);

  if (!req.body) return res.sendStatus(400);
  var id = req.params.id; // получаем id
  var rate = req.body.rate;

  models.People.findOneAndUpdate(
    { _id: id },
    { rate: rate },
    { new: true },
    (t, data) => {
      res.json(data);
    }
  ).catch(next);
});

app.post("/api/people/:id/note", (req, res, next) => {
  if (!req.user && !req.user.admin && !config.skipAuth) return res.json([]);

  if (!req.body) return res.sendStatus(400);
  var id = req.params.id; // получаем id
  var noteText = req.body.note;

  var note = {
    text: noteText,
    date: `${moment().format("DD.MM.YYYY")}`
  };

  models.People.findOne({ _id: id }, (t, result) => {
    const p = result.addNote(result, note);
    p.then(data => {
      res.json(data);
    });
  }).catch(next);
});

module.exports = app;
