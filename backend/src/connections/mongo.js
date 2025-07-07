import mongoose from "mongoose";

export const connectMongo=async ()=>{
    await mongoose.connect('mongodb://127.0.0.1:27017/chatApp');
    console.log("connected");
}