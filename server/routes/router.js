import express, { application } from "express";
import {
  adminLogin,
  adminOnly,
  forgotPassword,
  loginUser,
  logoutAdmin,
  logoutUser,
  protect,
  refreshAccessToken,
  register,
  resetPassword,
  verifyOtp,
} from "../controllers/authController.js";
import {
  createPrdouct,
  deleteProduct,
  getProduct,
  getProductId,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middleware/uploadProductImage.js";
import {
  addToCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";
import { getMyOrders, placeOrder } from "../controllers/orderController.js";
import { createCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", loginUser);
router.post("/auth/logout", protect, logoutUser);
router.post("/refresh", refreshAccessToken);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/verify-otp", verifyOtp);
router.post("/auth/reset-password", resetPassword);
router.get("/users/profile/", protect, (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user,
  });
});
router.get("/users/admin", protect, adminOnly, (req, res) => {
  res.json({
    message: "Welcome Admin 👑",
  });
});

router.post("/auth/admin/login", adminLogin);
router.post("/auth/admin/logout", protect,adminOnly, logoutAdmin);

//Public Product

router.get("/products", getProduct);
router.get("/products/:id", getProductId);

// create Category
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "../controllers/categoryController.js";
import uploadCategoryImage from "../middleware/uploadCategoryImage.js";

// CATEGORY ROUTES
router.post(
  "/categories/create",
  protect,
  adminOnly,
  uploadCategoryImage.single("image"),
  createCategory,
);



router.get("/categories", getCategories);

router.delete("/categories/:id", protect, adminOnly, deleteCategory);

// Admin Only Access Product

router.post(
  "/products/create",
  protect,
  adminOnly,
  upload.single("image"),
  createPrdouct,
);
router.put("/products/:id", protect, adminOnly,upload.single("image"), updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

//Cart

router.post("/carts/add", protect, addToCart);
router.get("/carts", protect, getCart);
router.put("/carts/update", protect, updateCartItem);
router.delete("/carts/delete", protect, removeCartItem);

//Orders

router.post("/orders", protect, placeOrder);
router.get("/orders/my-orders", protect, getMyOrders);

//Payment
router.post("/payments/create", protect, createCheckoutSession);

//router.post("/payments/webhook", express.raw({ type: application.json}), stripeWebhook);

export default router;
