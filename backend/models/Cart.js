const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      img: { type: String, required: true },
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model('Cart', CartSchema);