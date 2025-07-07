import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

export const Contacts=mongoose.model("Contact",ContactSchema);