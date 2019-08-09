module.exports = {
	// Загрузить модель юзера (пользователя)
	// На *nix-ах все файлы чуствительны к регистру
	User:require('./user'),
	Post:require('./post'),
  People: require('./people')
};
// Не забудем точку с запЕтой!
