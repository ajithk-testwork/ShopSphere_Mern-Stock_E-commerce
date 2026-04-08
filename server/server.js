import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/router.js";

import path from "path";  
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(
  cors({
    origin: ["https://shop-sphere-mern-stock-e-commerce-n.vercel.app",
            "http://localhost:5173"],
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ THIS LINE IS THE FIX
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api", router);

connectDB();

app.get("/", (req, res) => {
  return res.send("ShopSphere API is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
