import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000, // ✅ stop waiting forever
    });

    console.log("DB Connected!", conn.connection.host);
  } catch (error) {
    console.log("Mongoose connect error:", error.message);
    process.exit(1); // ✅ stop server if DB fails
  }
};

export default connectDB;