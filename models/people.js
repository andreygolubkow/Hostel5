"use strict";
const mongoose = require("mongoose");

const PeopleSchema = new mongoose.Schema(
  {
    name: { type: String, default: "", trim: true, maxlength: 255 },
    dob: { type: String, default: "", trim: true, maxlength: 12 },
    faculty: { type: String, default: "", trim: true, maxlength: 12 },
    group: { type: String, default: "", trim: true, maxlength: 12 },
    phone: { type: String, default: "", trim: true, maxlength: 12 },
    citizen: { type: String, default: "", trim: true, maxlength: 12 },
    room: { type: String, default: "", trim: true, maxlength: 4 },
    sex: { type: String, default: "", trim: true, maxlength: 1 },
    eduForm: { type: String, default: "", trim: true, maxlength: 10 },
    rate: { type: Number, default: 0, trim: true },
    notes: [
      {
        text: { type: String, default: "", maxlength: 1000 },
        date: { type: String, default: "", maxlength: 1000 }
      }
    ],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

/**
 * Validations
 */
PeopleSchema.path("name").required(true, "People name required");
/**
 * Pre-remove hook
 */
PeopleSchema.pre("remove", function(next) {
  next();
});

/**
 * Methods
 */

PeopleSchema.methods = {
  addNote: function(people, note) {
    this.notes.push({
      text: note.text,
      date: note.date
    });
    return this.save();
  }
};

/**
 * Statics
 */

PeopleSchema.statics = {
  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(_id) {
    return this.findOne({ _id }).exec();
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @api private
   */

  list: function(options) {
    const criteria = options.criteria || {};
    const page = options.page || 0;
    const limit = options.limit || 30;
    return this.find(criteria)
      .sort({ room: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  }
};

module.exports = mongoose.model("People", PeopleSchema);
