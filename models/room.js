const mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");

let roomSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    unique: true,
    maxlength: 4
  },
  sanitation: {
    type: Object,
    default: {}
  }
});

roomSchema.plugin(findOrCreate);

module.exports = mongoose.model("Room", roomSchema);
