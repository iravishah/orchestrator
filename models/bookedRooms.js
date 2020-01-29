const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const { v4 } = require('uuid');

const schema = new Schema({
  uid: { type: String },
  user_uid: { type: String },
  title: { type: String },
  type: { type: String },
  price: { type: Number },
  features: [],
  booking_from: { type: Date },
  booking_to: { type: Date },
  expiresAt: { type: Date, default: undefined }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

schema.pre('save', function (next) {
  this.uid = `br-${v4()}`;
  next();
});

/**
 * We have done this to remove the document after TTL and TTL is equals to the end date of booking.
 */

schema.index({ "expiresAt": 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('BookedRooms', schema);
