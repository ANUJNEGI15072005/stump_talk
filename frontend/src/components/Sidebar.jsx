import { Link } from "react-router-dom";

const Sidebar = ({ activePage }) => {
    return (
        <div className="h-screen w-1/5 hidden bg-black shadow-md py-6 px-4 lg:block fixed left-0 top-20 border-r border-gray-700">
            <div className="grid grid-rows-2 gap-4">
                <Link to="/home" className={`p-1 flex justify-center items-center ${activePage === "/home" ? "bg-gray-700 font-bold text-white" : "text-gray-300 hover:bg-gray-800 transition"}`}>
                    <h2 className="xl:text-2xl text-lg font-bold">CHAT FEED</h2>
                </Link>
                <Link to="/player-stats" className={`p-1 flex justify-center items-center  ${activePage === "/player-stats" ? "bg-gray-700 font-bold text-white" : "text-gray-300 hover:bg-gray-800 transition"}`}>
                    <h2 className="xl:text-2xl text-lg font-bold">PLAYER STATS</h2>
                </Link>
                {/* <Link to="/player-ranking" className={`p-1 flex justify-center items-center  ${activePage === "/player-ranking" ? "bg-gray-700 font-bold text-white" : "text-gray-300 hover:bg-gray-800 transition"}`}>
                    <h2 className="xl:text-2xl text-lg font-bold">PLAYER RANKING</h2>
                </Link> */}
                <Link to="/about" className={`p-1 flex justify-center items-center  ${activePage === "/about" ? "bg-gray-700 font-bold text-white" : "text-gray-300 hover:bg-gray-800 transition"}`}>
                    <h2 className="xl:text-2xl text-lg font-bold">ABOUT</h2>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
