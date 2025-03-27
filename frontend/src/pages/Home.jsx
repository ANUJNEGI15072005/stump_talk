import React, { useState, useEffect } from "react";
import { FaTrash, FaRegComment } from "react-icons/fa";
import axios from "axios";
import io from "socket.io-client";
import { Link } from "react-router-dom";

const socket = io("https://stumptalk.onrender.com", {
    transports: ["websocket", "polling"],
    withCredentials: true,
});

const Home = () => {
    const [content, setContent] = useState("");
    const [posts, setPosts] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [error, setError] = useState("");
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [username, setUsername] = useState(sessionStorage.getItem("username") || "Anonymous");

    useEffect(() => {
        axios.get("https://stumptalk.onrender.com/api/posts")
            .then((res) => setPosts(res.data))
            .catch((err) => console.error("Error fetching posts:", err));

        socket.on("newPost", (newPost) => {
            setPosts((prevPosts) => [newPost, ...prevPosts]);
        });

        return () => {
            socket.off("newPost");
        };
    }, []);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.length > 250) {
            setError("Post limit exceeded! Max 250 characters.");
            return;
        }
        setError("");

        try {
            const response = await axios.post("https://stumptalk.onrender.com/api/posts", { username, content });
            setPosts((prevPosts) => [{ ...response.data, replies: [] }, ...prevPosts]);
            setContent("");
        } catch (error) {
            console.error("Error posting:", error);
        }
    };

    const handleDeletePost = async (id) => {
        try {
            await axios.delete(`https://stumptalk.onrender.com/api/posts/${id}`);
            setPosts(posts.filter(post => post._id !== id));
        } catch (err) {
            console.error("Error deleting post:", err);
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

    const uniquePosts = Array.from(new Map(posts.map(post => [post._id, post])).values());

    return (
        <div className="w-full bg-black min-h-screen text-white p-6">
            <div className="bg-gray-900 p-4 shadow-md rounded-lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <textarea
                        placeholder="Know something about cricket?"
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            setError("");
                        }}
                        className="w-full min-h-[50px] bg-gray-800 text-white p-3 border border-gray-700 rounded-md outline-none resize-none"
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="self-end bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Post
                    </button>
                </form>
            </div>
            <div className="mt-5">
                {uniquePosts?.map((post, index) => {
                    const isExpanded = expandedPosts[post._id];
                    const minHeight = getMinHeight(post.content.length);

                    const directRepliesCount = post.replies ? post.replies.length : 0;

                    return (
                        <Link to={`/post/${post._id}`} key={post._id || index} className="block">
                            <div
                                className={`bg-gray-900 shadow-md rounded-lg mb-2 border border-gray-700 cursor-pointer transition-all duration-300 ${isExpanded ? 'h-auto' : minHeight}`}
                            >
                                <div className="py-2 px-4 ">
                                    <p className="md:text-lg lg:text-lg text-md font-semibold text-gray-200">{post.username}</p>
                                    <p
                                        className={`text-gray-300 whitespace-pre-wrap break-words overflow-hidden md:text-lg lg:text-lg text-md transition-all duration-300 ${isExpanded ? '' : 'line-clamp-5'}`}
                                        style={{ wordBreak: "break-word" }}
                                    >
                                        {post.content}
                                    </p>
                                </div>
                                <div className="flex pb-2 px-4 items-end justify-between ">
                                    <div className="flex items-center gap-2 text-gray-400 mt-2">
                                        <FaRegComment className="text-gray-500" />
                                        <span>{directRepliesCount}</span>
                                    </div>
                                    {post.username === username && (
                                        <button
                                            className="text-red-500 hover:text-red-400 flex items-center gap-1 z-10 relative"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleDeletePost(post._id);
                                            }}
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Home;
