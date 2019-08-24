const Logger = require("../logger");
const logger = new Logger();

let app = new (require("express")).Router();

app.use(require("./auth"));
app.use(require("./post"));
app.use(require("./peoples"));
app.use(require("./rooms"));
app.use(require("./search"));
app.use(require("./message"));
app.use(require("./document"));
app.use(require("./cabinet"));
app.use(require("./user"));
app.use(require("./floor"));

app.get("/", function(req, res, next) {
  if (req.user) return res.redirect("/cabinet");

  res.render("index");
});

app.get("/help", function(req, res, next) {
  if (req.user) return res.redirect("/cabinet");

  res.render("help");
});

module.exports = app;
