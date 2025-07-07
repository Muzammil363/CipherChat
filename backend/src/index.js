import express from "express"
import authRouter from './routes/auth.js'
import mongoose from "mongoose";
import { User } from "./models/User.js";
import { configDotenv } from "dotenv";
import { authMiddleware } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import userRouter from './routes/user.js';
import { connectMongo } from "./connections/mongo.js";
import messageRouter from './routes/Message.js'
configDotenv();


connectMongo();
const app=express();
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("/api/auth",authRouter);
app.use('/user',userRouter);
app.use('/api/chat',messageRouter);

app.get("/",async (req,res)=>{  
    // no action here 
    // in front end on / route direct request to /api/auth/validate with browser cookie and accessToken 
});

app.get("/protected",authMiddleware,(req,res)=>{
    return res.status(200).json({message:"validated"});
})

app.listen(3000,()=>{
    console.log("backend started on 3000");
})