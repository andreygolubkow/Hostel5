const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
const room = require('./room');

let floorSchema = new mongoose.Schema({
	floor: {
	  type: String,
    required: true,
    unique: true
  },
  message: {
	  type: String,
    default: "¯ _ (ツ) _ / ¯"
  },
  news: [
    {
      text: { type: String, default: '', maxlength: 1000 },
      date: { type: String, default: '', maxlength: 10 }
    }
  ],
  rooms: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room'
    }
  ]
});
floorSchema.plugin(findOrCreate);

module.exports = mongoose.model('Floor',floorSchema);
