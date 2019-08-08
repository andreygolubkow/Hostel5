import {PeopleModel} from "../model/people";

var express = require('express');
var router = express.Router();
var moment = require('moment');

router.post('/', function (req, res, next) {
  const p = new PeopleModel({
    name: "Иванов Петр"
  });

  p.save(function(err){
    if(err) return console.log(err);
    console.log("Сохранен объект", p);
  });

  res.json(p);
});

/* Получим контингент */
router.get('/', function(req, res, next) {
  var peoples = [
    {
      _id: 1,
      name: "Иванов Петр Михайлович",
      dob: "30.02.2001",
      faculty: "ФВС",
      group: "515-2",
      phone: "+79961111111",
      citizen: "РФ",
      room: "301",
      rate: 0,
      notes: [
        {
          text: "Шумел",
          date: "30.01.2019"
        },
        {
          text: "Помог с дежурством",
          date: "1.05.2019"
        }
      ]
    },
    {
      _id: 2,
      name: "Валентин Петров",
      dob: "30.02.2022",
      faculty: "РКФ",
      group: "515-1",
      phone: "+79962222211",
      citizen: "Казахстна",
      room: "302",
      rate: 1,
      notes: []
    }
  ];

  res.json(peoples);
});

/* Получим одного участника */
router.get('/:id', function(req, res, next) {
  var id = req.params.id; // получаем id

  var people = {
    _id: id,
    name: "Иванов Петр Михайлович",
    dob: "30.02.2001",
    faculty: "ФВС",
    group: "515-2",
    phone: "+79961111111",
    citizen: "РФ",
    room: "301",
    rate: 0,
    notes: [
      {
        text: "Шумел",
        date: "30.01.2019"
      },
      {
        text: "Помог с дежурством",
        date: "1.05.2019"
      }
    ],
    friends: [
      {
        _id: 1,
        name: "Михаил Петров"
      },
      {
        _id: 2,
        name: "Петр Первый"
      }
    ]
  };

  res.json(people);
});

/* Отравим рейтинг */
router.post('/:id/rate', function(req, res, next) {
  if(!req.body) return res.sendStatus(400);

  var id = req.params.id; // получаем id
  var rate = req.body.rate;

  var people = {
    _id: id,
    name: "Иванов Петр Михайлович",
    dob: "30.02.2001",
    faculty: "ФВС",
    group: "515-2",
    phone: "+79961111111",
    citizen: "РФ",
    room: "301",
    rate: 0,
    notes: [
      {
        text: "Шумел",
        date: "30.01.2019"
      },
      {
        text: "Помог с дежурством",
        date: "1.05.2019"
      }
    ],
    friends: [
      {
        _id: 1,
        name: "Михаил Петров"
      },
      {
        _id: 2,
        name: "Петр Первый"
      }
    ]
  };

  people.rate = rate;

  res.json(people);
});

/* Отправим заметку */
router.post('/:id/notes', function(req, res, next) {
  if(!req.body) return res.sendStatus(400);

  var id = req.params.id; // получаем id
  var noteText = req.body.note;

  var note = {
    text: noteText,
    date: `${moment().format("DD.MM.YYYY")}`
  };

  var people = {
    _id: id,
    name: "Иванов Петр Михайлович",
    dob: "30.02.2001",
    faculty: "ФВС",
    group: "515-2",
    phone: "+79961111111",
    citizen: "РФ",
    room: "301",
    rate: 0,
    notes: [
      {
        text: "Шумел",
        date: "30.01.2019"
      },
      {
        text: "Помог с дежурством",
        date: "1.05.2019"
      },
      note
    ],
    friends: [
      {
        _id: 1,
        name: "Михаил Петров"
      },
      {
        _id: 2,
        name: "Петр Первый"
      }
    ]
  };

  res.json(people);
});



module.exports = router;
