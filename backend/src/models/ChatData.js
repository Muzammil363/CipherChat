import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ["direct", "group"],
    default: "direct"
  },
  name: {
    type: String,
    default: ""
  },
  createdBy: {
    type: String,
    default: ""
  },
  members: {
    type: [String],
    required: true
  },
  leftMembers: {
    type: [String],
    default: []
  },
  lastMessage: {
    message: String,
    sender: String,
  },
  createdAt: {
    type:String
  },
  unreadCounts: {
    type: [
      {
        user: { type: String, required: true }, // email
        count: { type: Number, default: 0 }
      }
    ],
    default: []
  }
}, { timestamps: true });

chatSchema.index({ members: 1, type: 1 });

export const Chat = mongoose.model("Chat", chatSchema);
