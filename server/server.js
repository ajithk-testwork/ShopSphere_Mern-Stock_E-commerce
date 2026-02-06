import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/router.js"



dotenv.config();


const app = express();


//middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api", router)

connectDB();

app.get("/", (req, res) => {
    return res.send("ShopSphere API is runnig")
});

const PORT = process.env.PORT || 8080;


app.listen(PORT, () =>{
    console.log(`Server is Running on port ${PORT}`)
})