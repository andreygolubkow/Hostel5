const mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

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
  ]
});
floorSchema.plugin(findOrCreate);

module.exports = mongoose.model('Floor',floorSchema);
