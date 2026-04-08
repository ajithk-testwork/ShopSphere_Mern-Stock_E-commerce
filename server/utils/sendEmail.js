import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: `"ShopSphere 🛒" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family:sans-serif">
          <h2>${subject}</h2>
          <p>${text}</p>
        </div>
      `,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Email failed:", error);
    throw error; // IMPORTANT (so controller catch works)
  }
};

export default sendEmail;