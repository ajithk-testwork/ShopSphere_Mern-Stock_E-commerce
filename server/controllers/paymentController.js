import stripe from "../config/stripe.js";
import Order from "../models/Order.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("Received orderId:", orderId);

    const order = await Order.findById(orderId).populate("items.product");

    console.log("Order found:", order);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order items:", order.items);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.items.map((item) => {
        console.log("Item:", item);

        const price = Number(item.product.price);

        console.log("Price:", price);

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.product.name,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: item.quantity,
        };
      }),
      success_url: `https://shop-sphere-mern-stock-e-commerce-v.vercel.app/payment-success?orderId=${orderId}`,
      cancel_url: `https://shop-sphere-mern-stock-e-commerce-v.vercel.app/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    // ✅ find only that user's order
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id, // 🔥 ensures only logged-in user updates
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ prevent duplicate updates
    if (order.paymentStatus === "paid") {
      return res.json({ message: "Already paid", order });
    }

    // ✅ update payment
    order.paymentStatus = "paid";

    await order.save();

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Verification failed" });
  }
};