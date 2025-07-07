import mongoose from "mongoose";

mongoose.connect('mongodb://127.0.0.1:27017/chatApp');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique: true
    },

    fullName: {
        type: String,
        required: true,
        default: 'newUser'
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        default: ""
    }
},
    { timestamps: true }
)

export const User=mongoose.model("User",userSchema);

