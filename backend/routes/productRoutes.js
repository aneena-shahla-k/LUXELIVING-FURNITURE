// backend/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// 1. 🟢 GET ALL PRODUCTS OR FILTER BY CATEGORY
router.get("/", async (req, res) => {
  try {
    const { category } = req.query; 
    let filter = {};

    if (category) {
      filter.category = category.toLowerCase().trim();
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching filtered products" });
  }
});


router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const imgPath = req.file ? `uploads/${req.file.filename}` : "";

    if (!imgPath) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const newProduct = new Product({
      name,
      price: Number(price),
      category,
      img: imgPath,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to build product stack" });
  }
});

// 3. 🟡 EDIT PRODUCT BY ID
router.put("/edit/:id", upload.single("img"), async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const updateData = { name, price: Number(price), category };

    if (req.file) {
      updateData.img = `uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Update execution failed" });
  }
});

// 4. 🔴 DELETE PRODUCT BY ID
router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed" });
  }
});

module.exports = router;
