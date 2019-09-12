let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");
const config = require("../config");
const xl = require("excel4node");

app.get("/api/export/sanitary", function(req, res, next) {
  if (!req.user && !config.skipAuth) return res.json([]);
  if (req.user.sanitary || req.user.admin || req.user.inspector) {
    models.User.findById(req.user._id)
      .populate([
        {
          path: "sanitary.floors",
          model: "Floor",
          populate: {
            model: "Room",
            path: "rooms"
          }
        },
        {
          model: "Floor",
          path: "inspector.floors",
          populate: {
            model: "Room",
            path: "rooms"
          }
        }
      ])
      .then(f => {
        var wb = new xl.Workbook();
        var source;
        if (f.sanitary && f.sanitary.floors) {
          source = f.sanitary.floors;
        }
        if (f.inspector && f.sanitary.floors && f.sanitary.floors>0) {
          source = f.inspector.floors
        }
        for (
          var fCounter = 0;
          fCounter < source.length;
          fCounter++
        ) {
          const titleIndex = 1;
          const floor = source[fCounter];
          const rooms = floor.rooms;
          rooms.sort(function(left, right) {
            if (left.room < right.room) {
              return -1;
            } else if (left.room > right.room) {
              return 1;
            } else {
              return 0;
            }
          });

          var ws = wb.addWorksheet(`${floor.floor} Этаж`);

          const allDates = [];
          for (let rCounter = 0; rCounter < rooms.length; rCounter++) {
            allDates.push(...Object.keys(rooms[rCounter].sanitation));
            //Сразу запишем комнаты в столбик
            ws.cell(rCounter + 1 + titleIndex, titleIndex).string(
              rooms[rCounter].room
            );
          } // Собрали даты проверок
          const dates = Array.from(new Set(allDates));
          dates.sort(function(left, right) {
            return moment
              .utc(left, "DD.MM.YYYY")
              .diff(moment.utc(right, "DD.MM.YYYY"));
          });
          //Получили отсортированный массив дат
          //Запишем в 1 строку даты
          for (var i = 0; i < dates.length; i++) {
            ws.cell(titleIndex, i + 1 + titleIndex).string(dates[i]);
          }
          //запишем оценки
          for (let rCounter = 0; rCounter < rooms.length; rCounter++) {
            const room = rooms[rCounter];
            for (var i = 0; i < dates.length; i++) {
              if (room.sanitation[dates[i]]) {
                ws.cell(titleIndex + 1 + rCounter, i + 1 + titleIndex).number(
                  room.sanitation[dates[i]]
                );
              } else {
                ws.cell(titleIndex + 1 + rCounter, i + 1 + titleIndex).string(
                  "-"
                );
              }
            }
          }
        }
        wb.write("SanScore.xlsx", res);
      });
  }
});

module.exports = app;
