const mongoose = require("mongoose");

const decorCategorySchema = new mongoose.Schema({
  title: { type: String, required: true},
    slug: { type: String, required: true,unique: true},
    image: { type: String, required: true},
    items: [{type: String}],
    featured: { type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("DecorCategory",decorCategorySchema);