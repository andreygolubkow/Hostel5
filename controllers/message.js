let app = new (require("express")).Router();
const models = require("../models");
var moment = require("moment");
var XLSX = require("xlsx");
const formidable = require("formidable");
const axios = require("axios");
const config = require("../config");

app.post("/api/message", function(req, res, next) {
  //if(!req.user) return res.redirect('/login');

  axios
    .get(
      `https://www.google.com/recaptcha/api/siteverify?secret=${config.recaptcha}&response=${req.body.recaptcha}`
    )
    .then(data => {
      if (data.data.success) {
        req.body.message["answer"] = "";
        req.body.message["public"] = false;
        let message = new models.Message(req.body.message);
        message
          .save()
          .then(() => {
            res.json(message);
          })
          .catch(next);
      } else {
        res.json({ error: "recapcha error" });
      }
    });
});

app.get("/api/message", function(req, res, next) {
  var criteria = {};

  if (!req.user && !config.skipAuth) {
    criteria = { public: true };
  }
  models.Message.find(criteria)
    .then(p => {
      res.json(p);
    })
    .catch(next);
});

app.put("/api/message/:id", function(req, res, next) {
  if (!req.user && !config.skipAuth) {
    if (!id) return res.status(401);
  }

  const id = req.params.id;
  if (!id) return res.status(404);

  models.Message.findOneAndUpdate({ _id: id }, req.body)
    .then(p => {
      res.json(p);
    })
    .catch(next);
});

module.exports = app;
