// backend/routes/productRoutes.js

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// Cloudinary upload middleware
const upload = require("../middleware/upload");


// ===============================
// GET ALL PRODUCTS
// ===============================
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    if (category) {
      filter.category = category.toLowerCase().trim();
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(products);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error while fetching products",
    });
  }
});


// ===============================
// ADD PRODUCT
// ===============================
router.post("/", upload.single("img"), async (req, res) => {
  try {

    const { name, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        message: "Product image is required",
      });
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      category,
      img: req.file.path, // Cloudinary URL
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to add product",
    });

  }
});


// ===============================
// UPDATE PRODUCT
// ===============================
router.put("/edit/:id", upload.single("img"), async (req, res) => {
  try {

    const { name, price, category } = req.body;

    const updateData = {
      name,
      price: Number(price),
      category,
    };

    if (req.file) {
      updateData.img = req.file.path; // Cloudinary URL
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json(updatedProduct);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Update failed",
    });

  }
});


// ===============================
// DELETE PRODUCT
// ===============================
router.delete("/delete/:id", async (req, res) => {
  try {

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Delete failed",
    });

  }
});

module.exports = router;