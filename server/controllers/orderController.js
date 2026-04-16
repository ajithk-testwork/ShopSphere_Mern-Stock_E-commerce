import Order from "../models/Order.js";
import Cart from "../models/Cart.js";


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

  // ✅ clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};


  // GET USER ORDERS

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};
