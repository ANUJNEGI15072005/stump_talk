import React, { useEffect, useState } from "react";

const PlayerRanking = () => {
    const [rankingType, setRankingType] = useState(1);
    const [rankings, setRankings] = useState([]);
    const [rankingTitle, setRankingTitle] = useState("Test Batsman");

    const API_KEY = "process.env.PR_API_KEY";
    const API_HOST = "process.env.PR_API_HOST";

    const rankingOptions = [
        { id: 1, label: "Men Test Batsman" },
        { id: 2, label: "Men Test Bowlers" },
        { id: 3, label: "Men Test All-rounders" },
        { id: 4, label: "Men ODI Batsman" },
        { id: 5, label: "Men ODI Bowlers" },
        { id: 6, label: "Men ODI All-rounders" },
        { id: 7, label: "Men T20 Batsman" },
        { id: 8, label: "Men T20 Bowlers" },
        { id: 9, label: "Men T20 All-rounders" },
        { id: 10, label: "Women ODI Batsman" },
        { id: 11, label: "Women ODI Bowlers" },
        { id: 12, label: "Women ODI All-rounders" },
        { id: 13, label: "Women T20 Batsman" },
        { id: 14, label: "Women T20 Bowlers" },
        { id: 15, label: "Women T20 All-rounders" }
    ];

    const fetchRanking = async () => {
        try {
            const response = await fetch(`https://${API_HOST}/playerRanking/${rankingType}`, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": API_KEY,
                    "x-rapidapi-host": API_HOST
                }
            });

            if (!response.ok) {
            }

            const data = await response.json();

            if (data.status && Array.isArray(data.data)) {
                setRankings(data.data);
                setRankingTitle(data.type || "Ranking");
            } else {
                setRankings([]);
            }

        } catch (error) {
            setRankings([]);
        }
    };

    useEffect(() => {
        fetchRanking();
    }, [rankingType]);

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <div className="mb-4 flex justify-center">
                <select
                    className=" p-2  bg-gray-800 text-white border border-gray-700"
                    value={rankingType}
                    onChange={(e) => setRankingType(Number(e.target.value))}
                >
                    {rankingOptions.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <h2 className="text-xl font-semibold text-center mb-4">{rankingTitle}</h2>

            {rankings.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800">
                                <th className="p-3 border border-gray-700">Rank</th>
                                <th className="p-3 border border-gray-700">Player</th>
                                <th className="p-3 border border-gray-700">Country</th>
                                <th className="p-3 border border-gray-700">Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map((player, index) => (
                                <tr key={index} className="text-center border border-gray-700">
                                    <td className="p-3">{player.rank}</td>
                                    <td className="p-3 flex items-center justify-start gap-2">
                                        <img src={player.img} alt={player.name} className="w-8 h-8 rounded-full" />
                                        {player.name}
                                    </td>
                                    <td className="p-3">{player.country}</td>
                                    <td className="p-3">{player.rating}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-center text-gray-400">Something went wrong. Try again later</p>
            )}
        </div>
    );
};

export default PlayerRanking;
