const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const schema = new Schema({
  uid: { type: String },
  title: { type: String },
  type: { type: String },
  price: { type: Number },
  features: [],
  qty: { type: Number }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Rooms', schema);
