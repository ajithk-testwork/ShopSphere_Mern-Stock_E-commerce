import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY:", process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    console.log("📩 Sending email to:", to);

    const data = await resend.emails.send({
      from: "onboarding@resend.dev", // default sender
      to,
      subject,
      html: `<p>${text}</p>`,
    });

    console.log("✅ Email sent:", data);
  } catch (error) {
    console.error("❌ Email failed:", error);
  }
};

export default sendEmail;