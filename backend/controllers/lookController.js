// controllers/lookController.js
const Look = require('../models/Look');

const createLook = async (req, res) => {
  try {
    // 1. Core text fields validation
    const { roomType, title, products } = req.body;
    
    if (!req.files || !req.files['mainImg']) {
      return res.status(400).json({ success: false, message: 'Main room concept image is mandatory.' });
    }

    // 2. Extract main uploaded image path
    const mainImgPath = `/uploads/${req.files['mainImg'][0].filename}`;

    // 3. Parse and loop products array string back to native JSON
    let parsedProducts = [];
    if (products) {
      parsedProducts = JSON.parse(products);
    }

    // 4. Attach corresponding uploaded sub-images matching keys: productImages_0, productImages_1...
    const finalProducts = parsedProducts.map((prod, index) => {
      const fileField = req.files[`productImages_${index}`];
      let subImagePath = '';
      
      if (fileField && fileField[0] && fileField[0].size > 0) {
        subImagePath = `/uploads/${fileField[0].filename}`;
      }
      
      return {
        title: prod.title,
        price: Number(prod.price) || 0,
        productImage: subImagePath
      };
    });

    // 5. Save configured asset directly inside MongoDB cluster
    const newLook = await Look.create({
      roomType,
      title,
      mainImg: mainImgPath,
      products: finalProducts
    });

    res.status(201).json({
      success: true,
      message: "Curated space configuration saved successfully! ✨",
      data: newLook
    });

  } catch (error) {
    console.error("Backend Payload Save Error:", error);
    res.status(500).json({ success: false, message: 'Internal validation failed.', error: error.message });
  }
};

// Client view display trigger logic
const getLooksByRoom = async (req, res) => {
  try {
    const { roomType } = req.params;
    const looks = await Look.find({ roomType: roomType.toLowerCase(), isActive: true });
    res.status(200).json({ success: true, count: looks.length, data: looks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// 🔄 ADD THIS: Get all looks for Admin panel
const getAllLooks = async (req, res) => {
  try {
    const looks = await Look.find();
    res.status(200).json({ success: true, data: looks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🗑️ ADD THIS: Delete look layout for Admin panel
const deleteLook = async (req, res) => {
  try {
    const { id } = req.params;
    await Look.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Look deleted successfully! 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createLook, getLooksByRoom, getAllLooks, deleteLook };


