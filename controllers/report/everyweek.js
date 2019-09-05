let app = new (require("express")).Router();
let models = require("../../models");
const model = require("../../models");
const moment = require("moment");

app.get("/report/:floor/everyweek", function(req, res, next) {
  if (!req.params.floor) return res.status(404);

  // Ищем заметки со среды, т.к. собрания по вторникам
  const weekday = 3;

  var tuesday = moment()
    .utc()
    .day(+weekday);

  if (tuesday.dayOfYear() > moment().dayOfYear()) {
    tuesday = tuesday.subtract(7, "days");
  }
  tuesday = tuesday.set({ hours: 14, minute: 0, millisecond: 0 });
  //Взяли этаж
  model.Floor.
  findOne({
    floor: req.params.floor
  })
    .populate({
      path: "rooms",
      model: "Room"
    })
    .then(floor => {
      return models.RoomNote.find({ createdAt: { $gt: tuesday.format() } })
        .populate("room")
        .then(n => ({
          dates: {
            start: tuesday.format("DD.MM.YYYY"),
            end: moment().format("DD.MM.YYYY")
          },
          week: [
            tuesday.format("DD.MM.YYYY"),
            moment(tuesday).add(1, 'days').format("DD.MM.YYYY"),
            moment(tuesday).add(2, 'days').format("DD.MM.YYYY"),
            moment(tuesday).add(3, 'days').format("DD.MM.YYYY"),
            moment(tuesday).add(4, 'days').format("DD.MM.YYYY"),
            moment(tuesday).add(5, 'days').format("DD.MM.YYYY"),
            moment(tuesday).add(6, 'days').format("DD.MM.YYYY"),
            moment(tuesday).add(7, 'days').format("DD.MM.YYYY"),
          ],
          notes: n,
          floor: floor
        }));
    })
    .then(data => {
      return res.render("report/everyweek", data);
    })
    .catch(next);

});

module.exports = app;
