import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    chatId:{
        type:String,
        required:true
    },
    mid:{
        type:Date,
        required:true
    },
    sender : {
        type:String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required:true
    },
    message: {
        type:String,
    },
    encryptedFor: {
        type: [
            {
                userEmail: { type: String, required: true },
                ciphertext: { type: String, required: true }
            }
        ],
        default: []
    },
    createdAt:{
        type:String,
    }
}
)

messageSchema.index({chatId:1 ,createdAt:-1 });
export const Messages=mongoose.model("Message",messageSchema);

