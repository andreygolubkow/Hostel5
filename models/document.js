'use strict';
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema(
  {
    name: { type: String, default: '', trim: true, maxlength: 255 },
    url: { type: String, default: '', trim: true, maxlength: 255 },
    public: { type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now }
}, {timestamps: true});

/**
 * Validations
 */
DocumentSchema.path('name').required(true, 'Name required');
DocumentSchema.path('url').required(true, 'Url required');
/**
 * Pre-remove hook
 */
DocumentSchema.pre('remove', function(next) {
  next();
});

/**
 * Methods
 */

/**
 * Statics
 */

DocumentSchema.statics = {
  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @api private
   */

  load: function(_id) {
    return this.findOne({ _id })
      .exec();
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

module.exports =mongoose.model('Document', DocumentSchema);
