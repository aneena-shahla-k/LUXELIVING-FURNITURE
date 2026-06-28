// backend/models/Look.js
const mongoose = require('mongoose');

const EmbeddedProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  productImage: { type: String, required: true } 
});

const LookSchema = new mongoose.Schema({
  roomType: { type: String, required: true, lowercase: true },
  title: { type: String, required: true },
  mainImg: { type: String, required: true }, 
  products: [EmbeddedProductSchema],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Look', LookSchema);
