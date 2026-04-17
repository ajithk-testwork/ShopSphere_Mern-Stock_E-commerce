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

  line_items: order.items.map((item) => ({
    price_data: {
      currency: "inr",
      product_data: {
        name: item.product.name,
      },
      unit_amount: Math.round(Number(item.product.price) * 100),
    },
    quantity: item.quantity,
  })),

  // ✅ ADD THIS
  metadata: {
    orderId: orderId,
  },

  // ✅ IMPORTANT CHANGE
  success_url: `https://shop-sphere-mern-stock-e-commerce-v.vercel.app/payment-success?session_id={CHECKOUT_SESSION_ID}`,

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
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ message: "Session ID required" });
    }

    // 🔥 Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session) {
      return res.status(400).json({ message: "Invalid session" });
    }

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const orderId = session.metadata.orderId;

    if (!orderId) {
      return res.status(400).json({ message: "Order ID missing in metadata" });
    }

    // ✅ Get order
    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Prevent duplicate update
    if (order.paymentStatus !== "paid") {
      order.paymentStatus = "paid";
      order.isPaid = true;
      order.paidAt = new Date();

      await order.save();
    }

    // 🔥 IMPORTANT: RE-FETCH WITH POPULATE
    const updatedOrder = await Order.findById(orderId)
      .populate("items.product");

    res.json({
      success: true,
      order: updatedOrder,
    });

  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({ message: "Verification failed" });
  }
};