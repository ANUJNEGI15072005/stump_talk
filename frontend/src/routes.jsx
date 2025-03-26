import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import PostDetail from "./pages/PostDetail";
import ReplyDetail from "./pages/ReplyDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import PlayerStats from "./pages/PlayerStats";
import PlayerRanking from "./pages/PlayerRanking";
import About from "./pages/About";
import LiveScore from "./pages/LiveScore";

const AppRoutes = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 900);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Home />} />
                </Route>
                <Route path="/post/:postId" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<PostDetail />} />
                </Route>
                <Route path="/reply/:replyId" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<ReplyDetail />} />
                </Route>
                <Route path="/player-stats" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<PlayerStats />} />
                </Route>
                <Route path="/player-ranking" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<PlayerRanking />} />
                </Route>
                <Route path="/about" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<About />} />
                </Route>
                {isMobile && (
                    <Route path="/live-score" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route index element={<LiveScore />} />
                    </Route>
                )}
            </Routes>
        </Router>
    );
};

export default AppRoutes;


