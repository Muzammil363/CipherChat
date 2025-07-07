import mongoose from "mongoose";

const refreshTokenSchema=new mongoose.Schema({
    refreshToken:{
        type:String,
        required:true
    },
    expiresAt: {
        type:Date,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});


export const Refresh=mongoose.model("Refresh",refreshTokenSchema);
