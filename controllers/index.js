const Logger = require('../logger');
const logger = new Logger();

let app = new (require('express').Router)();

app.use(require('./auth'));
app.use(require('./post'));
app.use(require('./peoples'));
app.use(require('./rooms'));
app.use(require('./search'));
app.use(require('./message'));

module.exports = app;
