import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

// CREATE CATEGORY (ADMIN)
export const createCategory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Category image required" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "categories",
    });

    const category = await Category.create({
      name: req.body.name,
      image: result.secure_url,        // ✅ Cloudinary URL
      imagePublicId: result.public_id, // ✅ Needed for delete
      createdBy: req.user._id,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Delete image from Cloudinary
    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};