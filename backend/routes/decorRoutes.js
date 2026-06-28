const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const DecorCategory = require("../models/DecorCategory");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });


// CREATE CATEGORY
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),

  async (req, res) => {
    try {
      const {
        title,
        slug,
        items,
        featured,
      } = req.body;

      const newCategory =
        new DecorCategory({
          title,
          slug,

          image: req.file
            ? `/uploads/${req.file.filename}`
            : "",

          items: JSON.parse(items),

          featured,
        });

      await newCategory.save();

      res.status(201).json({
        success: true,
        message:
          "Decor category created",
        data: newCategory,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// GET ALL
router.get("/", async (req, res) => {
  try {
    const categories =
      await DecorCategory.find();

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// DELETE
router.delete(
  "/:id",
  protect,
  adminOnly,

  async (req, res) => {
    try {
      await DecorCategory.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Category deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

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
        featured: featured === 'true' || featured === true,
      };

      if (items) {
        updateData.items = JSON.parse(items);
      }

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updatedCategory = await DecorCategory.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      res.json({
        success: true,
        message: "Decor category updated successfully! ✨",
        data: updatedCategory,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);


module.exports = router;