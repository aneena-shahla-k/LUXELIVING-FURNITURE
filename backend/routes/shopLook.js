// routes/shopLook.js

const express = require("express");
const router = express.Router();

// Cloudinary upload middleware
const upload = require("../middleware/upload");

const {
  createLook,
  getLooksByRoom,
  getAllLooks,
  deleteLook,
  updateLook,
} = require("../controllers/lookController");

// Accept 1 main image + up to 10 product images
const lookUploadFields = upload.fields([
  { name: "mainImg", maxCount: 1 },
  { name: "productImages_0", maxCount: 1 },
  { name: "productImages_1", maxCount: 1 },
  { name: "productImages_2", maxCount: 1 },
  { name: "productImages_3", maxCount: 1 },
  { name: "productImages_4", maxCount: 1 },
  { name: "productImages_5", maxCount: 1 },
  { name: "productImages_6", maxCount: 1 },
  { name: "productImages_7", maxCount: 1 },
  { name: "productImages_8", maxCount: 1 },
  { name: "productImages_9", maxCount: 1 },
]);

// =========================
// ADD NEW LOOK
// =========================
router.post("/add", lookUploadFields, createLook);

// =========================
// GET ALL LOOKS
// =========================
router.get("/", getAllLooks);

// =========================
// GET LOOKS BY ROOM
// =========================
router.get("/:roomType", getLooksByRoom);

// =========================
// UPDATE LOOK
// =========================
router.put("/edit/:id", lookUploadFields, updateLook);

// =========================
// DELETE LOOK
// =========================
router.delete("/delete/:id", deleteLook);

module.exports = router;