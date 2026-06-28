// routes/shopLook.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createLook, getLooksByRoom, getAllLooks, deleteLook } = require('../controllers/lookController');

// Multer Disk Storage Configuration Engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure your 'uploads' folder exists in backend root directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Fields structure payload architecture map (Accepts 1 main image + up to 10 sub items)
const lookUploadFields = upload.fields([
  { name: 'mainImg', maxCount: 1 },
  { name: 'productImages_0', maxCount: 1 },
  { name: 'productImages_1', maxCount: 1 },
  { name: 'productImages_2', maxCount: 1 },
  { name: 'productImages_3', maxCount: 1 },
  { name: 'productImages_4', maxCount: 1 },
  { name: 'productImages_5', maxCount: 1 },
  { name: 'productImages_6', maxCount: 1 },
  { name: 'productImages_7', maxCount: 1 },
  { name: 'productImages_8', maxCount: 1 },
  { name: 'productImages_9', maxCount: 1 }
]);

// 🛠️ Matches 'http://localhost:5001/api/shop-look/add' from your frontend completely!
router.post('/add', lookUploadFields, createLook);

router.get('/', getAllLooks); // 🛠️ URL: http://localhost:5001/api/shop-look/
router.delete('/delete/:id', deleteLook); // 🛠️ URL: http://localhost:5001/api/shop-look/delete/:id

router.post('/add', lookUploadFields, createLook);
router.get('/:roomType', getLooksByRoom);

module.exports = router;
