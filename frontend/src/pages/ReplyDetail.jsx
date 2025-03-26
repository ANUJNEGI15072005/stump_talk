import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash, FaRegComment } from "react-icons/fa";
import axios from "axios";

const ReplyDetail = () => {
    const { replyId } = useParams();
    const navigate = useNavigate();
    const [reply, setReply] = useState(null);
    const [subReplies, setSubReplies] = useState([]);
    const [replyContent, setReplyContent] = useState("");
    const [error, setError] = useState("");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [username, setUsername] = useState(sessionStorage.getItem("username") || "Anonymous");

    useEffect(() => {
        axios.get(`http://localhost:5000/api/posts/replies/${replyId}`)
            .then((res) => {
                setReply(res.data);
                setSubReplies(res.data.replies || []);
            })
            .catch((err) => console.error("Error fetching reply:", err));
    }, [replyId]);

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (replyContent.length > 250) {
            setError("Reply limit exceeded! Max 250 characters.");
            return;
        }
        setError("");
        try {
            const response = await axios.post(`http://localhost:5000/api/posts/replies/${replyId}/reply`, {
                username,
                content: replyContent,
            });
            setSubReplies([...subReplies, response.data]);
            setReplyContent("");
        } catch (error) {
            console.error("Error posting reply:", error);
        }
    };

    const handleDeleteReply = async (subReplyId) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/replies/${subReplyId}`);
            setSubReplies(subReplies.filter((subReply) => subReply._id !== subReplyId));
        } catch (error) {
            console.error("Error deleting reply:", error.response ? error.response.data : error.message);
        }
    };

    const getMinHeight = (contentLength) => {
        if (screenWidth <= 321) {
            if (contentLength <= 35) return "h-[105px]";
            if (contentLength <= 70) return "h-[130px]";
            if (contentLength <= 98) return "h-[155px]";
            if (contentLength <= 140) return "h-[175px]";
            return "h-[200px]";
        } else if (screenWidth <= 376) {
            if (contentLength <= 40) return "h-[105px]";
            if (contentLength <= 80) return "h-[130px]";
            if (contentLength <= 120) return "h-[155px]";
            if (contentLength <= 160) return "h-[175px]";
            return "h-[200px]";
        } else if (screenWidth <= 426) {
            if (contentLength <= 46) return "h-[105px]";
            if (contentLength <= 92) return "h-[130px]";
            if (contentLength <= 138) return "h-[155px]";
            if (contentLength <= 188) return "h-[175px]";
            return "h-[200px]";
        } else if (screenWidth <= 769) {
            if (contentLength <= 46) return "h-[115px]";
            if (contentLength <= 92) return "h-[140px]";
            if (contentLength <= 138) return "h-[165px]";
            if (contentLength <= 180) return "h-[200px]";
            return "h-[230px]";
        } else if (screenWidth <= 1025) {
            if (contentLength <= 70) return "h-[115px]";
            if (contentLength <= 140) return "h-[145px]";
            if (contentLength <= 210) return "h-[175px]";
            return "h-[200px]";
        } else {
            if (contentLength <= 100) return "h-[120px]";
            if (contentLength <= 200) return "h-[150px]";
            return "h-[175px]";
        }
    };

    if (!reply) {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-lg font-semibold animate-pulse">Fetching Data...</p>
                </div>
            </div>
        );
    }

    const isExpanded = expandedPosts[reply._id];
    const minHeight = getMinHeight(reply.content.length);

    return (
        <div className="dark-bg fade-in p-4">
            <div className="w-full bg-black min-h-screen text-white p-6 ">
                <div className={`bg-gray-900 px-4 py-2 shadow-md rounded-lg mb-5 border border-gray-700 ${getMinHeight(reply.content.length)}`}>
                    <p className="md:text-lg lg:text-lg text-md font-semibold text-gray-200">{reply.username}</p>
                    <p className="text-gray-300 break-words">{reply.content}</p>
                </div>

                <div className="bg-gray-900 p-4 shadow-md rounded-lg border border-gray-700 mb-4">
                    <form onSubmit={handleReplySubmit} className="flex flex-col gap-2">
                        <textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => {
                                setReplyContent(e.target.value);
                                setError("");
                            }}
                            className="w-full min-h-[50px] bg-gray-800 text-white p-3 border border-gray-700 rounded-md outline-none resize-none"
                        />
                        {error && <p className="text-red-500">{error}</p>}
                        <button
                            type="submit"
                            className="self-end bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Reply
                        </button>
                    </form>
                </div>

                <div>
                    {subReplies.length > 0 ? (
                        subReplies.map((subReply) => {
                            const isExpanded = expandedPosts[subReply._id];
                            const minHeight = getMinHeight(subReply.content.length);
                            return (
                                <div
                                    key={subReply._id}
                                    className={`bg-gray-900 shadow-md rounded-lg mb-3 border border-gray-700 cursor-pointer transition-all duration-300 ${isExpanded ? 'h-auto' : minHeight}`}
                                    onClick={() => navigate(`/reply/${subReply._id}`)}
                                >
                                    <div className="py-2 px-4 ">
                                        <p className="text-gray-200 font-semibold md:text-lg lg:text-lg text-md">{subReply.username}</p>
                                        <p className="text-gray-300 break-words md:text-lg lg:text-lg text-md">{subReply.content}</p>
                                    </div>
                                    <div className="flex pb-2 px-4 items-end justify-between">
                                        <div className="flex items-center gap-2 text-gray-400 mt-2">
                                            <FaRegComment className="text-gray-500" />
                                            <span>{subReply.replies ? subReply.replies.length : 0}</span>
                                        </div>
                                        {subReply.username === username && (
                                            <button
                                                className="text-red-500 hover:text-red-400 flex items-center gap-1 z-10 relative"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteReply(subReply._id);
                                                }}
                                            >
                                                <FaTrash />Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-500">No replies yet.</p>
                    )}
                </div>
            </div>
        </div>

    );
};

export default ReplyDetail;
