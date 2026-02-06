import mongoose from "mongoose";


const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("DB Connected!")
    }catch(error){
        console.log("Mongoose connect error:", error.message)
    }
}

export default connectDB