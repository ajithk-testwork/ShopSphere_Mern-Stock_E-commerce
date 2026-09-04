import dns from "dns";
import mongoose from "mongoose";

// Use public DNS for MongoDB SRV lookup
dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const connectDB = async () => {
  try {
    console.log("Starting MongoDB connection...");

    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("✅ DB Connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
  }
};

export default connectDB;