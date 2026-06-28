const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  image: {
    type: String,
    required: true,
  },
});

const decorDetailSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
      },

      decorSlug: {
        type: String,
        required: true,
        unique: true,
      },

      mainImage: {
        type: String,
        required: true,
      },

      products: [productSchema],
    },
    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "DecorDetail",
    decorDetailSchema
  );