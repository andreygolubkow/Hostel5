const models = require("../models");
let app = new (require("express")).Router();
let config = require("../config/");

app.get("/api/me", function(req, res, next) {
  res.json(req.user);
});

app.get("/api/user/", function(req, res, next) {
  if ((!req.user || !req.user.admin) && !config.skipAuth) {
    res.status = 401;
    res.json([]);
  }

  return models.User
    .find({})
    .populate({
      model: "Room",
      path: "room"
    })
    .then(data => (res.json(data)))
    .catch(e => next)
  /*

  .populate({
      model: "Floor",
      path: "sanitary.floors"
    })
    .populate({
      model: "Floor",
      path: "inspector.floors"
    })
    .populate({
      model: "Floor",
      path: "floorHead.floors"
    })

   */
});

module.exports = app;
