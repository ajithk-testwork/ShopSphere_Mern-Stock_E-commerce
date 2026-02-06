import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
     role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    forgotPassword: {
      type: String,
    },
    forgotPasswordOtp: {
      type: String,
    },
    forgotPasswordOtpExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
