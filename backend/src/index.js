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
import conversationRouter from './routes/conversation.js'
import cors from "cors"
import { Server } from "socket.io";
import { socketActions } from "./connections/Socket.js";
import jwt from "jsonwebtoken"
configDotenv();


connectMongo();
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use("/api/auth",authRouter);
app.use('/user',userRouter);
app.use('/api/chat',messageRouter);
app.use('/api',conversationRouter);

app.get("/",async (req,res)=>{  
    return res.status(200).json({ message: "Chat API is running" });
});

app.get("/protected",authMiddleware,(req,res)=>{
    return res.status(200).json({message:"validated"});
})

const PORT = process.env.PORT || 3000;
const server=app.listen(PORT,()=>{
    console.log(`backend started on ${PORT}`);
});

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

export const socketMap=new Map();
const readCookie = (cookieHeader = "", name) => {
    return cookieHeader
      .split(";")
      .map(cookie => cookie.trim())
      .find(cookie => cookie.startsWith(`${name}=`))
      ?.split("=")[1];
};

io.use((socket, next) => {
    const token = readCookie(socket.handshake.headers.cookie, "authToken");
    if (!token) return next(new Error("No token provided"));
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
        socket.email = decoded.email;
        socketMap.set(socket.email,socket.id);
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

io.on("connection",socketActions);
