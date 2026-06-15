import mongoose from "mongoose";

export const connectMongo=async ()=>{
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/chatApp');
    console.log("MongoDB connected");
}
