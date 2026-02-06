import express from "express";
import { adminOnly, forgotPassword, loginUser, protect, refreshAccessToken, register, resetPassword, verifyOtp } from "../controllers/authController.js";
import { createPrdouct, deleteProduct, getProduct, getProductId, updateProduct } from "../controllers/productController.js";
import upload from "../middleware/uploadProductImage.js";
import { addToCart, getCart, removeCartItem, updateCartItem } from "../controllers/cartController.js";
import { getMyOrders, placeOrder } from "../controllers/orderController.js";


const router = express();


router.post("/auth/register", register);
router.post("/auth/login", loginUser);
router.post("/refresh", refreshAccessToken)
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


//Public Product

router.get("/products", getProduct);
router.get("products/:id", getProductId);

// Admin Only Access Product

router.post("/products/create", protect, adminOnly, upload.single("image"), createPrdouct);
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct)

//Cart 

router.post("/carts/add", protect, addToCart);
router.get("/carts", protect, getCart);
router.put("/carts/update", protect, updateCartItem);
router.delete("/carts/delete", protect, removeCartItem);


//Orders 

router.post("/orders", protect, placeOrder);
router.get("/orders/my-orders", protect, getMyOrders)



export default router;