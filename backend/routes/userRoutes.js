// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/User"); 
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Users fetch ചെയ്യാൻ പറ്റിയില്ല", error: error.message });
  }
});

// 2. DELETE USER
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User കണ്ടില്ല" });
    }
    
    if (user.role === "admin") {
      return res.status(400).json({ success: false, message: "Admin account ഡിലീറ്റ് ചെയ്യാൻ കഴിയില്ല" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User-െ വിജയകരമായി നീക്കം ചെയ്തു 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
