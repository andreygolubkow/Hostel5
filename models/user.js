var findOrCreate = require('mongoose-findorcreate');
const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: {
    type: String
  },
	// Логин
	username:{
		type:String, // тип: String
	},
  room: {
    type: String
  },
  url:{
    type:String, // тип: String
  },
  vkId: {type: String, unique: true},
  admin: {type: Boolean, default: false}
	// Здесь будут и другие поля, но сейчас еще рано их сюда ставить!
});

// Теперь подключим плагины (внешнии модули)
userSchema.plugin(findOrCreate);
// Компилируем и Экспортируем модель
module.exports = mongoose.model('User',userSchema);
