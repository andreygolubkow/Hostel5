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
  }
});
floorSchema.plugin(findOrCreate);

module.exports = mongoose.model('Floor',floorSchema);
