import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    senderEmail : {
        type:String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required:true
    },
    receiverEmail : {
        type:String,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required:true
    },
    text:{
        type:String
    },
    image: {
        type:String
    }
},
{timestamps:true}
)

export const Messages=mongoose.model("Message",messageSchema);

