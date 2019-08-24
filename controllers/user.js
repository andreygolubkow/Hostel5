let app = new (require("express")).Router();

app.get("/api/user", function(req, res, next) {
  res.json(req.user);
});

module.exports = app;
