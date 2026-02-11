import Category from "../models/Category.js";
import fs from "fs";
import path from "path";

// CREATE CATEGORY (ADMIN)
export const createCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Category image required" });
    }

    const category = await Category.create({
      name: req.body.name,
      image: `/uploads/categoryImages/${req.file.filename}`,
      createdBy: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL CATEGORIES (PUBLIC)
export const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: -1 });
  res.json(categories);
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // delete image from uploads folder
    if (category.image) {
      const imagePath = path.join(process.cwd(), category.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
