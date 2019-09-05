let app = new (require("express")).Router();

app.use(require("./everyweek"));

module.exports = app;
