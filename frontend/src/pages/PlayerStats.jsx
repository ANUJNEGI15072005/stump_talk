import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const PlayerStats = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [playerData, setPlayerData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const API_HOST = "import.meta.env.PS_API_HOST";
    const API_KEY = "import.meta.env.PS_API_KEY";

    const fetchPlayerID = async (playerName) => {
        setLoading(true);
        setError(null);
        setPlayerData(null);

        try {
            const response = await fetch(
                `https://${API_HOST}/players?paged=1&per_page=1&search=${encodeURIComponent(playerName)}`,
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": API_HOST,
                        "x-rapidapi-key": API_KEY,
                    },
                }
            );
            if (response.status === 429) {
                setError("Something went wrong. Try again later.");
                setLoading(false);
                return null;
            }

            const data = await response.json();
            if (data?.response?.items?.length > 0) {
                return data.response.items[0].pid;
            } else {
                setError("Player not found.");
                setLoading(false);
                return null;
            }
        } catch (err) {
            setError("Failed to fetch player ID.");
            setLoading(false);
            return null;
        }
    };

    const fetchPlayerStats = async (playerId) => {
        try {
            const response = await fetch(
                `https://${API_HOST}/players/${playerId}/stats`,
                {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": API_HOST,
                        "x-rapidapi-key": API_KEY,
                    },
                }
            );



            const data = await response.json();
            if (data?.response) {
                setPlayerData(data.response);
            } else {
                setError("Player stats not found.");
            }
        } catch (err) {
            setError("Failed to fetch player stats.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            const playerId = await fetchPlayerID(searchTerm);
            if (playerId) {
                fetchPlayerStats(playerId);
            }
        }
    };

    const renderTable = (stats, type) => {
        if (!stats) return null;

        const headers =
            type === "batting"
                ? {
                    matches: "Matches",
                    innings: "Innings",
                    runs: "Runs",
                    average: "Average",
                    strike: "Strike Rate",
                    run100: "Centuries",
                    run50: "Fifties",
                }
                : {
                    matches: "Matches",
                    innings: "Innings",
                    wickets: "Wickets",
                    economy: "Economy",
                    bestinnings: "Best Innings",
                    wicket5i: "5 Wickets",
                    wicket10m: "10 Wickets",
                };

        const formats = {
            t20: "T20",
            odi: "ODI",
            test: "Test",
            t20i: "T20I",
            firstclass: "FC",
        };

        return (
            <div className="mb-6 w-full">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-yellow-400 mb-2 text-center">
                    {type === "batting" ? "Batting Stats" : "Bowling Stats"}
                </h3>

                <div className="w-full overflow-hidden">
                    <table className="hidden md:table w-full text-center border-collapse border border-gray-600">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-base border border-gray-600 text-yellow-400">
                                    Stat
                                </th>
                                {Object.values(formats).map((format) => (
                                    <th key={format} className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-base border border-gray-600 text-yellow-400">
                                        {format}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(headers).map(([key, label], index) => (
                                <tr key={key} className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-800"}>
                                    <td className="px-2 md:px-4 py-1 md:py-2 font-semibold text-yellow-400 border border-gray-600 text-xs md:text-base">
                                        {label}
                                    </td>
                                    {Object.keys(formats).map((formatKey) => (
                                        <td key={formatKey} className="px-2 md:px-4 py-1 md:py-2 border border-gray-600 text-xs md:text-base">
                                            {stats[formatKey]?.[key] || "N/A"}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="md:hidden space-y-4">
                        {Object.keys(formats).map((formatKey) => (
                            <div key={formatKey} className="bg-gray-800 p-3 md:p-4 rounded-lg shadow-md">
                                <h4 className="text-yellow-400 text-center font-semibold mb-2 text-base md:text-lg">{formats[formatKey]}</h4>
                                {Object.entries(headers).map(([key, label]) => (
                                    <div key={key} className="flex justify-between px-2 py-1 border-b border-gray-600 text-sm md:text-base">
                                        <span className="text-yellow-400 font-medium">{label}</span>
                                        <span>{stats[formatKey]?.[key] || "N/A"}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900 text-white px-4">
            <div className="w-full max-w-xl mt-6 mb-8">
                <form onSubmit={handleSearch} className="flex items-center bg-gray-800 p-3 rounded-lg shadow-md w-full">
                    <input
                        type="text"
                        placeholder="Enter Player Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-transparent text-white outline-none placeholder-gray-400 px-2"
                    />
                    <button type="submit" className="text-yellow-400 hover:text-yellow-500">
                        <FaSearch size={18} />
                    </button>
                </form>
            </div>

            {loading && <p className="text-lg font-semibold text-yellow-300">Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {playerData && (
                <div className="w-full max-w-4xl bg-gray-800 p-4 md:p-6 shadow-lg rounded-lg text-center">
                    {renderTable(playerData.batting, "batting")}
                    {renderTable(playerData.bowling, "bowling")}
                </div>
            )}

        </div>
    );
};

export default PlayerStats;
