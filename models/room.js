const mongoose = require("mongoose");
var findOrCreate = require("mongoose-findorcreate");

let roomSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
    unique: true,
    maxlength: 4
  },
  sanitation: [
    {
      score: {
        type: Number,
        min: 0,
        max: 5,
        default: 4
      },
      date: {
        type: String
      }
    }
  ]
});

roomSchema.plugin(findOrCreate);

module.exports = mongoose.model("Room", roomSchema);
