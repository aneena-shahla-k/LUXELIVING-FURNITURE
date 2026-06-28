import DecorCategory from "../models/DecorCategory.js";

export const createDecorCategory = async (req, res) => {
  try {
    const { title, slug, items, featured } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const newCategory = new DecorCategory({
      title,
      slug,
      image,
      items: JSON.parse(items),
      featured,
    });

    await newCategory.save();

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getDecorCategories = async (req, res) => {
  try {
    const categories =
      await DecorCategory.find();

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};