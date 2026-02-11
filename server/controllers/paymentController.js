import stripe from "../config/stripe.js";
import Cart from "../models/Cart.js";




export const createPaymentIntent = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const amount = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Stripe uses paise
    currency: "inr",
    metadata: { userId: req.user._id.toString() },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
};
