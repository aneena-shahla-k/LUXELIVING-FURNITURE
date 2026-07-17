// controllers/lookController.js

const Look = require("../models/Look");

// ===============================
// CREATE LOOK
// ===============================
const createLook = async (req, res) => {
  try {
    const { roomType, title, products } = req.body;

    if (!req.files || !req.files.mainImg) {
      return res.status(400).json({
        success: false,
        message: "Main image is required",
      });
    }

    const mainImg = req.files.mainImg[0].path;

    let parsedProducts = [];

    if (products) {
      parsedProducts = JSON.parse(products);
    }

    const finalProducts = parsedProducts.map((product, index) => {
      const imageField = req.files[`productImages_${index}`];

      return {
        title: product.title,
        price: Number(product.price) || 0,
        productImage: imageField
          ? imageField[0].path
          : "",
      };
    });

    const newLook = await Look.create({
      roomType: roomType.toLowerCase(),
      title,
      mainImg,
      products: finalProducts,
    });

    res.status(201).json({
      success: true,
      message: "Look created successfully",
      data: newLook,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET ALL LOOKS
// ===============================
const getAllLooks = async (req, res) => {
  try {
    const looks = await Look.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: looks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// GET LOOKS BY ROOM
// ===============================
const getLooksByRoom = async (req, res) => {
  try {
    const looks = await Look.find({
      roomType: req.params.roomType.toLowerCase(),
    });

    res.status(200).json({
      success: true,
      data: looks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// UPDATE LOOK
// ===============================
const updateLook = async (req, res) => {
  try {
    const { roomType, title, products } = req.body;

    const look = await Look.findById(req.params.id);

    if (!look) {
      return res.status(404).json({
        success: false,
        message: "Look not found",
      });
    }

    look.roomType = roomType;
    look.title = title;

    if (req.files && req.files.mainImg) {
      look.mainImg = req.files.mainImg[0].path;
    }

    let parsedProducts = [];

    if (products) {
      parsedProducts = JSON.parse(products);
    }

    const updatedProducts = parsedProducts.map((product, index) => {
      const imageField = req.files
        ? req.files[`productImages_${index}`]
        : null;

      return {
        title: product.title,
        price: Number(product.price) || 0,
        productImage: imageField
          ? imageField[0].path
          : (
              look.products[index]
                ? look.products[index].productImage
                : ""
            ),
      };
    });

    look.products = updatedProducts;

    await look.save();

    res.status(200).json({
      success: true,
      message: "Look updated successfully",
      data: look,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ===============================
// DELETE LOOK
// ===============================
const deleteLook = async (req, res) => {
  try {
    await Look.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Look deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  createLook,
  getAllLooks,
  getLooksByRoom,
  updateLook,
  deleteLook,
};