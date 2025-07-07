import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
});

export const Request=mongoose.model("Request",RequestSchema);
