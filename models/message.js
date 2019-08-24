"use strict";
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    from: { type: String, default: "anonym", trim: true, maxlength: 255 },
    subject: { type: String, default: "", trim: true, maxlength: 255 },
    text: { type: String, default: "", trim: true, maxlength: 255 },
    answer: { type: String, default: "", trim: true, maxlength: 255 },
    public: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

/**
 * Validations
 */
MessageSchema.path("text").required(true, "Text required");
MessageSchema.path("from").required(true, "From required");
/**
 * Pre-remove hook
 */
MessageSchema.pre("remove", function(next) {
  next();
});

/**
 * Methods
 */

/**
 * Statics
 */

MessageSchema.statics = {
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

module.exports = mongoose.model("Message", MessageSchema);
