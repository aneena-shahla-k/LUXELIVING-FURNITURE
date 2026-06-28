const express = require("express");

const router = express.Router();

const DecorDetail =
  require(
    "../models/decorDetailModel"
  );

const upload =
  require(
    "../middleware/decorDetailUpload"
  );

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);



router.post(
  "/",

  protect,
  adminOnly,

  upload.any(),

  async (req, res) => {

    try {

      /* MAIN IMAGE */
      const mainImageFile =
        req.files.find(
          (file) =>
            file.fieldname ===
            "mainImage"
        );

      if (!mainImageFile) {

        return res.status(400).json({
          success: false,
          message:
            "Main image required",
        });
      }

      /* PRODUCTS */
      const products =
        JSON.parse(
          req.body.products || "[]"
        );

      /* FORMAT PRODUCTS */
      const formattedProducts =
        products.map(
          (product, index) => {

            const imageFile =
              req.files.find(
                (file) =>
                  file.fieldname ===
                  `productImage_${index}`
              );

            return {
              name: product.name,

              price: product.price,

              image: imageFile
                ? `/uploads/${imageFile.filename}`
                : "",
            };
          }
        );

      /* CREATE */
      const detail =
        await DecorDetail.create({

          title:
            req.body.title,

          decorSlug:
            req.body.decorSlug,

          mainImage:
            `/uploads/${mainImageFile.filename}`,

          products:
            formattedProducts,
        });

      res.status(201).json({
        success: true,
        detail,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);



/* ======================================
   GET SINGLE PAGE
====================================== */

router.get(
  "/:slug",

  async (req, res) => {

    try {

      const detail =
        await DecorDetail.findOne({

          decorSlug:
            req.params.slug,
        });

      if (!detail) {

        return res.status(404).json({
          success: false,
          message:
            "Decor detail not found",
        });
      }

      res.status(200).json(detail);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  }
);

// ======================================
// 🔄 GET ALL DECOR DETAILS (For Admin Inventory Grid)
// ======================================
router.get("/", async (req, res) => {
  try {
    const details = await DecorDetail.find();
    res.status(200).json(details);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================
// 🗑️ DELETE DECOR DETAIL PAGE
// ======================================
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await DecorDetail.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Decor detail profile removed successfully! 🗑️" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ======================================
// 🔄 UPDATE / EDIT DECOR DETAIL WITH DYNAMIC SUB-ITEMS
// ======================================
router.put("/:id", protect, adminOnly, upload.any(), async (req, res) => {
  try {
    const { title, decorSlug, products } = req.body;
    const updateData = { title, decorSlug };

    /* Main Image Update Check */
    const mainImageFile = req.files.find(file => file.fieldname === "mainImage");
    if (mainImageFile) {
      updateData.mainImage = `/uploads/${mainImageFile.filename}`;
    }

    /* Sub Products Re-mapping Evaluation */
    if (products) {
      const parsedProducts = JSON.parse(products);
      updateData.products = parsedProducts.map((product, index) => {
        const imageFile = req.files.find(file => file.fieldname === `productImage_${index}`);
        
        return {
          name: product.name,
          price: Number(product.price) || 0,
          image: imageFile ? `/uploads/${imageFile.filename}` : product.image
        };
      });
    }

    const updatedDetail = await DecorDetail.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ success: true, detail: updatedDetail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;