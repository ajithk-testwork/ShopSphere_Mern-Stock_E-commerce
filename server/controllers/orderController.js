import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import mongoose from "mongoose";


 //  PLACE ORDER

export const placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const totalAmount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user._id,

    // ✅ USER SNAPSHOT
    userInfo: {
      name: req.user.name,
      email: req.user.email,
    },

    

    // ✅ PRODUCT SNAPSHOT
    items: cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    })),

    

    shippingAddress,
    totalAmount,
  });

  console.log("USER FROM TOKEN:", req.user);
console.log("EMAIL:", req.user?.email);

  // ✅ clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};


  // GET USER ORDERS


export const getMyOrders = async (req, res) => {
  console.log("TOKEN USER ID:", req.user._id);

  const orders = await Order.find({
    user: req.user._id,
  });

  console.log("FOUND ORDERS:", orders);

  res.json(orders);
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Optional: restrict flow (recommended 🔥)
    const validFlow = {
      processing: ["shipped"],
      shipped: ["delivered"],
      delivered: [],
    };

    if (!validFlow[order.orderStatus].includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid status change from ${order.orderStatus} → ${orderStatus}`,
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};