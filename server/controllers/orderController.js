import Order from "../models/Order.js";
import Cart from "../models/Cart.js";


 //  PLACE ORDER

export const placeOrder = async (req, res) => {
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
    items: cart.items,
    totalAmount,
  });

  await Cart.deleteOne({ user: req.user._id });

  res.status(201).json(order);
};


  // GET USER ORDERS

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate(
    "items.product"
  );

  res.json(orders);
};
