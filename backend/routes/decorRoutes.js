const express = require("express");
const router = express.Router();

const DecorCategory = require("../models/DecorCategory");
const upload = require("../middleware/upload");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// =========================
// CREATE CATEGORY
// =========================
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, slug, items, featured } = req.body;

      const newCategory = new DecorCategory({
        title,
        slug,

        image: req.file ? req.file.path : "",

        items: items ? JSON.parse(items) : [],

        featured: featured === "true" || featured === true,
      });

      await newCategory.save();

      res.status(201).json({
        success: true,
        message: "Decor category created successfully.",
        data: newCategory,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// =========================
// GET ALL CATEGORIES
// =========================
router.get("/", async (req, res) => {
  try {
    const categories = await DecorCategory.find().sort({
      createdAt: -1,
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// =========================
// DELETE CATEGORY
// =========================
router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      await DecorCategory.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Category deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// =========================
// UPDATE CATEGORY
// =========================
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, slug, items, featured } = req.body;

      const updateData = {
        title,
        slug,
        featured: featured === "true" || featured === true,
      };

      if (items) {
        updateData.items = JSON.parse(items);
      }

      if (req.file) {
        updateData.image = req.file.path;
      }

      const updatedCategory =
        await DecorCategory.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message: "Decor category updated successfully.",
        data: updatedCategory,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;