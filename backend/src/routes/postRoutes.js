import express from "express";
import { getPosts, createPost, replyToPost, deletePost, deleteReply, getPostById, getReplyById, addSubReply, deleteSubReply } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.delete("/:id", deletePost);

router.get("/:postId", getPostById);
router.post("/:postId/reply", replyToPost);
router.delete("/replies/:replyId", deleteReply);

router.get("/replies/:replyId", getReplyById);
router.post("/replies/:replyId/reply", addSubReply);
router.delete("/replies/:replyId/reply/:subReplyId", deleteSubReply);

export default router;
