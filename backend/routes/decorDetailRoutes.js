const express = require("express");
const router = express.Router();

const DecorDetail = require("../models/decorDetailModel");
const upload = require("../middleware/decorDetailUpload");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");


// ======================================
// CREATE DECOR DETAIL
// ======================================
router.post(
  "/",
  protect,
  adminOnly,
  upload.any(),
  async (req, res) => {
    try {
      const mainImageFile = req.files.find(
        (file) => file.fieldname === "mainImage"
      );

      if (!mainImageFile) {
        return res.status(400).json({
          success: false,
          message: "Main image required",
        });
      }

      const products = JSON.parse(req.body.products || "[]");

      const formattedProducts = products.map((product, index) => {
        const imageFile = req.files.find(
          (file) => file.fieldname === `productImage_${index}`
        );

        return {
          name: product.name,
          price: Number(product.price) || 0,
          image: imageFile ? imageFile.path : "",
        };
      });

      const detail = await DecorDetail.create({
        title: req.body.title,
        decorSlug: req.body.decorSlug,
        mainImage: mainImageFile.path,
        products: formattedProducts,
      });

      res.status(201).json({
        success: true,
        detail,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);


// ======================================
// GET SINGLE DECOR DETAIL
// ======================================
router.get("/:slug", async (req, res) => {
  try {
    const detail = await DecorDetail.findOne({
      decorSlug: req.params.slug,
    });

    if (!detail) {
      return res.status(404).json({
        success: false,
        message: "Decor detail not found",
      });
    }

    res.status(200).json(detail);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ======================================
// GET ALL DECOR DETAILS
// ======================================
router.get("/", async (req, res) => {
  try {
    const details = await DecorDetail.find().sort({
      createdAt: -1,
    });

    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ======================================
// DELETE DECOR DETAIL
// ======================================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await DecorDetail.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Decor detail removed successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ======================================
// UPDATE DECOR DETAIL
// ======================================
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.any(),
  async (req, res) => {
    try {
      const { title, decorSlug, products } = req.body;

      const existing = await DecorDetail.findById(req.params.id);

      if (!existing) {
        return res.status(404).json({
          success: false,
          message: "Decor detail not found",
        });
      }

      const updateData = {
        title,
        decorSlug,
      };

      const mainImageFile = req.files.find(
        (file) => file.fieldname === "mainImage"
      );

      if (mainImageFile) {
        updateData.mainImage = mainImageFile.path;
      }

      if (products) {
        const parsedProducts = JSON.parse(products);

        updateData.products = parsedProducts.map((product, index) => {
          const imageFile = req.files.find(
            (file) => file.fieldname === `productImage_${index}`
          );

          return {
            name: product.name,
            price: Number(product.price) || 0,
            image: imageFile
              ? imageFile.path
              : existing.products[index]
              ? existing.products[index].image
              : "",
          };
        });
      }

      const updatedDetail = await DecorDetail.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        detail: updatedDetail,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;