"use strict";
const mongoose = require("mongoose");

const RoomNoteSchema = new mongoose.Schema(
  {
    text: { type: String, default: "", trim: true, maxlength: 255 },
    date: { type: String, default: "", trim: true, maxlength: 12 },
    state: { type: String, default: "", trim: true, maxlength: 255 },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room"
    },
    level: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

/**
 * Validations
 */
RoomNoteSchema.path("text").required(true, "Note text required");
/**
 * Pre-remove hook
 */
RoomNoteSchema.pre("remove", function(next) {
  next();
});

module.exports = mongoose.model("RoomNote", RoomNoteSchema);
