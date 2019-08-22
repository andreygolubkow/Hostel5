var findOrCreate = require('mongoose-findorcreate');
const mongoose = require('mongoose');
const floor = require('./floor');

let userSchema = new mongoose.Schema({
  name: {
    type: String
  },
	// Логин
	username:{
		type:String, // тип: String
	},
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room'
  },
  url:{
    type:String, // тип: String
  },
  vkId: {type: String, unique: true},
  admin: {type: Boolean, default: false},
  sanitary: {
    type: Object,
    floors: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Room'
        }
    ],
  },
  floorHead: {type: Boolean, default: false},
});

// Теперь подключим плагины (внешнии модули)
userSchema.plugin(findOrCreate);
// Компилируем и Экспортируем модель
module.exports = mongoose.model('User',userSchema);
