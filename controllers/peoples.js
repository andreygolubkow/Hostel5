let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");
const config = require("../config");
const Bluebird = require("bluebird");
const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
var parseExcelDate = require('../libs/excelUtils');

const withAsync = fn => (req, res, next) => fn(req, res, next).catch(next);

const isAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    res.status(401).json({ msg: "unauthorized" });
  }
};

const filterData = xls => xls.name && xls.room && (xls.citizen ||  xls.phone || xls.sex || xls.eduForm);

const importPeoples = withAsync(async (req, res) => {
  const file = req.files[0];
  if (!file) {
    return res.status(400).json({ error: "file required" });
  }
  const workbook = XLSX.read(file.buffer);
  const json = XLSX.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]],
    { header: 0 }
  );

  const filtered = json.filter(filterData);

  for (let xls of filtered) {
    await saveData(xls);
  }

  // альтернативный варинат
  // обрабатываем не больее 10 строк за раз
  //await Bluebird.map(filtered, saveData, { concurrency: 10 });

  res.json({ msg: "success" });
});

const saveData = async xls => {
  const v = {
    name: xls.name ? `${xls.name}` : "",
    dob: xls.dob ? moment(parseExcelDate(xls.dob)).format('DD.MM.YYYY') : null,
    faculty: xls.faculty ? `${xls.faculty}` : null,
    group: xls.group ? `${xls.group}` : null,
    phone: xls.phone ? `${xls.phone}` : null,
    citizen: xls.citizen ? `${xls.citizen}` : null,
    room: xls.room ? `${xls.room}` : "000",
    sex: xls.sex ? `${xls.sex}` : null,
    eduForm: xls.eduForm ? `${xls.eduForm}` : null
  };

  const floorDoc = await models.Floor.findOrCreate(
    { floor: v.room[0] },
    {
      floor: v.room[0],
      message: "¯ _ (ツ) _ / ¯",
      news: [],
      rooms: []
    }
  );

  //Если нет комнаты - создаем
  const roomDoc = await models.Room.findOrCreate(
    { room: { $eq: v.room } },
    { room: v.room }
  );

  if (!floorDoc.doc.rooms.find(rnp => rnp._id.equals(roomDoc.doc._id))) {
    floorDoc.doc.rooms.push(roomDoc.doc);
  }

  await floorDoc.doc.save();

  v.room = roomDoc.doc._id;

  const update = await models.People.findOneAndUpdate({name: v.name, dob: v.dob}, v, {new: true});
  if (!update) {
    const people = new models.People(v);
    await people.save();
  }
};

app.post("/api/people", isAdmin, upload.any(), importPeoples);

function addPeople(xls) {
  return new Promise(function(resolve, reject) {
    if (!xls.name || !xls.sex || !xls.room) {
      return resolve();
    }
    const v = {
      name: xls.name ? `${xls.name}` : "",
      dob: xls.dob ? `${xls.dob}` : null,
      faculty: xls.faculty ? `${xls.faculty}` : null,
      group: xls.group ? `${xls.group}` : null,
      phone: xls.phone ? `${xls.phone}` : null,
      citizen: xls.citizen ? `${xls.citizen}` : null,
      room: xls.room ? `${xls.room}` : "000",
      sex: xls.sex ? `${xls.sex}` : null,
      eduForm: xls.eduForm ? `${xls.eduForm}` : null
    };
    var floor;
    var room;
    models.Floor.findOrCreate(
      { floor: v.room[0] },
      {
        floor: v.room[0],
        message: "¯ _ (ツ) _ / ¯",
        news: [],
        rooms: []
      }
    )
      .then(floorDoc => {
        floor = floorDoc.doc;
        return models.Room.findOrCreate(
          { room: { $eq: v.room } },
          { room: v.room }
        );
      })
      .then(roomDoc => {
        if (!floor.rooms.find(rnp => rnp._id.equals(roomDoc.doc._id))) {
          floor.rooms.push(roomDoc.doc);
        }
        room = roomDoc.doc;
        return floor.save();
      })
      .then(d => {
        v.room = room._id;
        let people = new models.People(v);
        return people.save();
      })
      .then(_ => resolve());
  });
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
