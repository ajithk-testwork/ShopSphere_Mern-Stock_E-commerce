import { BrevoClient } from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Sending email...");
    console.log("📧 To:", to);
    console.log("📧 Subject:", subject);

    const result = await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "ShopSphere",
      },

      to: [
        {
          email: to,
        },
      ],

      subject,
      htmlContent: html,
    });

    console.log("✅ Brevo email sent:", result.messageId);

    return result;
  } catch (error) {
    console.error("❌ Brevo email failed:", error);
    throw error;
  }
};

export default sendEmail;