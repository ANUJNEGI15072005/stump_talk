import { Post, Reply } from "../models/Post.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("replies").sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

export const createPost = async (req, res) => {
    try {
        const { username, content } = req.body;
        if (!username || !content) {
            return res.status(400).json({ error: "Username and content are required" });
        }
        const newPost = new Post({ username, content, replies: [] });
        const savedPost = await newPost.save();
        req.io.emit("newPost", savedPost);
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPost = await Post.findByIdAndDelete(id);
        if (!deletedPost) return res.status(404).json({ error: "Post not found" });
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
};

export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId).populate("replies");
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const replyToPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { username, content, parentReplyId } = req.body;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newReply = new Reply({ username, content, parentReplyId, replies: [] });
        await newReply.save();

        if (parentReplyId) {
            const parentReply = await Reply.findById(parentReplyId);
            if (!parentReply) return res.status(404).json({ message: "Parent reply not found" });
            parentReply.replies.push(newReply._id);
            await parentReply.save();
        } else {
            post.replies.push(newReply._id);
            await post.save();
        }

        req.io.emit("newReply", { postId, reply: newReply });
        res.status(201).json(newReply);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const deletedReply = await Reply.findByIdAndDelete(replyId);
        if (!deletedReply) return res.status(404).json({ error: "Reply not found" });
        res.json({ message: "Reply deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getReplyById = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.replyId)
            .populate({
                path: "replies",
                populate: { path: "replies" } // Populate nested replies if needed
            });

        if (!reply) {
            return res.status(404).json({ message: "Reply not found" });
        }
        res.json(reply);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addSubReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const { username, content } = req.body;

        const parentReply = await Reply.findById(replyId);
        if (!parentReply) return res.status(404).json({ error: "Reply not found" });

        const newSubReply = new Reply({ username, content, parentReplyId: replyId, replies: [] });
        await newSubReply.save();

        parentReply.replies.push(newSubReply._id);
        await parentReply.save();

        res.status(201).json(newSubReply);
    } catch (error) {
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

export const deleteSubReply = async (req, res) => {
    try {
        const { subReplyId } = req.params;
        const deletedSubReply = await Reply.findByIdAndDelete(subReplyId);
        if (!deletedSubReply) return res.status(404).json({ error: "Sub-reply not found" });
        res.json({ message: "Sub-reply deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
