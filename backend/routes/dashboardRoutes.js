// backend/routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Look = require("../models/Look");
const DecorCategory = require("../models/DecorCategory");
const DecorDetail = require("../models/decorDetailModel");
const User = require("../models/User"); 

router.get("/stats", async (req, res) => {
  try {
    const [totalProducts, totalLooks, totalCategories, totalDetails, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Look.countDocuments(),
      DecorCategory.countDocuments(),
      DecorDetail.countDocuments(),
      User.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      counts: {
        totalProducts,
        shopTheLookItems: totalLooks,
        decorCollections: totalCategories,
        detailPages: totalDetails,
        totalUsers 
      }
    });
  } catch (error) {
    console.error("Dashboard calculation error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;
