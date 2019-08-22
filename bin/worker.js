const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session'); // Сессии
const MongoStore = require('connect-mongo')(session); // Хранилище сессий в монгодб
const cons = require('consolidate');
const config = require('../config');
const Logger = require('../logger');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const logger = new Logger(); //  Загрузить логгер!
require('./dbinit');
const ejs = require('ejs');
const passport = require("passport"); // Инициализация датабазы
// Загрузим express
let app = express();
// Создадим новый сервер
// Время ответа
app.use(require('./rt'));

app.use('/office', express.static(path.join(__dirname, "../dist")));
app.use('/assets', express.static(path.join(__dirname, "../assets")));
app.use('/public',express.static(path.join(__dirname,'../public')));

// Парсер Куки!
app.use(require('cookie-parser')());
// Теперь сессия
// поставить хендлер для сессий
app.use(session({
    secret: config.secret,
    // Замените на что нибудь
    resave: false,
    // Пересохранять даже если нету изменений
    saveUninitialized: true,
    // Сохранять пустые сессии
    store: new MongoStore({ mongooseConnection: require('mongoose').connection })
    // Использовать монго хранилище
}));
// JSON Парсер :)
app.use(bodyParser.json({
    limit:"10kb"
}));
app.use(bodyParser.urlencoded({
    extended:true
}));

app.engine('html', cons.ejs);
// установить движок рендеринга
app.set('view engine', 'html');
// папка с образами
app.set('views', __dirname + '/../views');

app.use(require('./../controllers')); // Монтируем контроллеры!


// Обработчик ошибок
app.use(require('./errorHandler'));


// Запустим сервер на порту 3000 и сообщим об этом в консоли.
// Все Worker-ы  должны иметь один и тот же порт
app.listen(config.port, function(err){
	if(err) throw err;
	// Если есть ошибка сообщить об этом
	logger.log(`Running server at port ${config.port}!`);
	// Иначе сообщить что мы успешно соединились с мастером
	// И ждем сообщений от клиентов
});
