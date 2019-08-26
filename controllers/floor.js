let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");

app.get("/api/floor", function(req, res, next) {
  if (!req.user) {
    res.json([]);
    return;
  }
  if (req.user.admin) {
    models.Floor.find({})
      .populate("rooms")
      .then(f => res.json(f));
    return;
  }
  if (req.user.sanitary) {
    models.User.findById(req.user._id)
      .populate("sanitary.floors")
      .then(f => {
        res.json(f);
      });
  }
});

module.exports = app;
