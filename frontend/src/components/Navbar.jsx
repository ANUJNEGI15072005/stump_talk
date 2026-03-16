import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { IoClose, IoMenu } from "react-icons/io5";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/login");
    };

    const menuItems = [
        { name: "CHAT FEED", path: "/home" },
        { name: "PLAYER STATS", path: "/player-stats" },
        { name: "PLAYER RANKING", path: "/player-ranking" },
        { name: "LIVE SCORE", path: "/live-score" },
        { name: "ABOUT", path: "/about" },
    ];

    return (
        <>
            <nav className="bg-black shadow-md px-4 py-2 flex justify-between items-center fixed top-0 w-full z-50 border-b border-gray-700">

                <div className="w-1/3 flex lg:hidden justify-start  items-center">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="text-white text-2xl "
                    >
                        <IoMenu />
                    </button>
                </div>

                <div className="w-1/3 flex lg:justify-start justify-center items-center">
                    <img src={logo} alt="Logo" className="lg:h-16 h-12" />
                </div>

                <div className="w-1/3 hidden lg:flex justify-center">
                    <h1 className="text-4xl font-bold text-white">#PITCHSIDECHAT!</h1>
                </div>

                <div className="w-1/3 flex justify-end relative items-center">
                    <FiUser
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="md:text-5xl text-3xl cursor-pointer text-white hover:text-red-500 transition duration-300"
                    />

                    {showConfirm && (
                        <div className="absolute top-16 right-0 bg-gray-900 shadow-lg border border-gray-700 p-4 rounded-lg flex flex-col items-center">
                            <p className="mb-2 text-gray-300">Logout?</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="bg-gray-700 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition duration-300"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-lg z-50 p-5 transform transition-transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute top-4 right-4 text-white text-3xl"
                >
                    <IoClose />
                </button>

                <ul className="mt-10 text-white space-y-4">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`block px-4 py-2 rounded-lg transition duration-300 ${location.pathname === item.path
                                    ? "bg-gray-700 text-white font-bold"
                                    : "hover:bg-gray-800 hover:text-gray-300"
                                    }`}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Navbar;
