import Product from "../models/Product.js";

// ==========================
// CREATE PRODUCT
// ==========================
export const createProduct = async (req, res) => {
  try {
    // 🔒 Auth check
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    // 🖼 Image check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Product image is required",
      });
    }

    const { name, price, category, stock, description } = req.body;

    // 📌 Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price and category are required",
      });
    }

    const product = await Product.create({
      name,
      price,
      category,
      stock: stock || 0,
      description: description || "",
      image: `/uploads/productImages/${req.file.filename}`,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};



// ==========================
// GET ALL PRODUCTS
// ==========================
export const getProduct = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    // 📌 Filter by category
    if (category) {
      filter.category = category;
    }

    // 🔍 Search by name
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("category", "name image")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};



// ==========================
// GET SINGLE PRODUCT
// ==========================
export const getProductId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name image"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Invalid product ID",
    });
  }
};



// ==========================
// UPDATE PRODUCT
// ==========================
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updateData = { ...req.body };

    // 🖼 If new image uploaded
    if (req.file) {
      updateData.image = `/uploads/productImages/${req.file.filename}`;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("category", "name image");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};



// ==========================
// DELETE PRODUCT
// ==========================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
};