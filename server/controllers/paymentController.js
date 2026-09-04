import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import sendEmail from "../utils/sendEmail.js";

import { paymentSuccessEmail } from "../utils/emailTemplates.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body;

    console.log("Received orderId:", orderId);

    const order = await Order.findById(orderId).populate(
      "items.product"
    );

    console.log("Order found:", order);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    console.log("Order items:", order.items);

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ["card"],

      mode: "payment",

      // ADD THIS
      metadata: {
        orderId: orderId,
      },

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

      success_url:
        `https://shop-sphere-mern-stock-e-commerce-v.vercel.app/payment-success?orderId=${orderId}`,

      cancel_url:
        `https://shop-sphere-mern-stock-e-commerce-v.vercel.app/payment-cancel`,
    });

    res.json({
      url: session.url,
    });

  } catch (error) {

    console.error("Stripe Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {

    const { orderId } = req.body;

    console.log(
      "Payment verification started:",
      orderId
    );

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }


    if (order.paymentStatus === "paid") {

      return res.json({
        success: true,
        message: "Already paid",
        order,
      });

    }


    order.paymentStatus = "paid";

    await order.save();


    console.log(
      "Payment status updated to paid:",
      order._id
    );

    sendEmail(
      order.userInfo.email,

      "ShopSphere Payment Successful 💳",

      paymentSuccessEmail(
        order.userInfo.name,
        order
      )

    ).catch((error) => {

      console.error(
        "Payment success email failed:",
        error.message
      );

    });


    res.json({

      success: true,

      message: "Payment verified successfully",

      order,

    });

  } catch (error) {

    console.error(
      "Payment verification error:",
      error
    );

    res.status(500).json({
      message: "Verification failed",
    });

  }
};

