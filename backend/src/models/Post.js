import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
    parentReplyId: { type: mongoose.Schema.Types.ObjectId, ref: "Reply", default: null },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }], // Change to ObjectId
}, { timestamps: true });

const postSchema = new mongoose.Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }], // Change to ObjectId
}, { timestamps: true });

export const Post = mongoose.model("Post", postSchema);
export const Reply = mongoose.model("Reply", replySchema);

