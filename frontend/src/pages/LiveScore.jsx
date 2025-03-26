import React, { useEffect, useState } from "react";

const LiveScore = () => {
    const [liveMatches, setLiveMatches] = useState([]);

    const API_KEY = "21a1c04499mshb0835b11649435fp13cccbjsn813cf0b848c8";
    const API_HOST = "cricket-api-free-data.p.rapidapi.com";

    const fetchLiveMatches = async () => {
        try {
            const response = await fetch("https://cricket-api-free-data.p.rapidapi.com/cricket-livescores", {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": API_KEY,
                    "X-RapidAPI-Host": API_HOST,
                },
            });

            if (!response.ok) {
                throw new Error(`Live API request failed: ${response.status}`);
            }

            const data = await response.json();

            if (data.status === "success" && Array.isArray(data.response)) {
                const extractedMatches = data.response.flatMap(series =>
                    series.matchList.map(match => ({
                        matchTitle: match.matchTitle || "Match Title Not Available",
                        seriesName: series.seriesName || "Series Name Not Available",
                        matchFormat: match.matchFormat || "Format Not Available",
                        matchStatus: match.matchStatus || "Status Not Available",
                        teamOne: match.teamOne?.name || "Not Available",
                        teamTwo: match.teamTwo?.name || "Not Available",
                        teamOneScore: match.teamOne?.score || "Not Available",
                        teamTwoScore: match.teamTwo?.score || "Not Available",
                    }))
                );

                setLiveMatches(extractedMatches);
            }
        } catch (error) {
            console.error("Error fetching live matches:", error);
        }
    };

    useEffect(() => {
        fetchLiveMatches();
        const interval = setInterval(fetchLiveMatches, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-full bg-black shadow-md py-6 px-4 pb-18 lg:hidden fixed right-0 top-20 border-l border-gray-700 overflow-y-auto hidden-scrollbar">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-white underline decoration-gray-500">LIVE MATCHES</h1>
            </div>
            {liveMatches.length > 0 ? (
                liveMatches.map((match, index) => (
                    <div key={index} className="bg-gray-900 p-3 rounded-lg mb-4">
                        <p className="text-white font-bold">{match.matchTitle}</p>
                        <p className="text-gray-400">{match.seriesName} - {match.matchFormat}</p>
                        <p className="text-yellow-400 mt-2">Team 1: {match.teamOne} ({match.teamOneScore})</p>
                        <p className="text-yellow-400">Team 2: {match.teamTwo} ({match.teamTwoScore})</p>
                        <p className="text-green-500 font-bold">{match.matchStatus}</p>
                    </div>
                ))
            ) : (
                <p className="text-white text-center">No Live Matches Available</p>
            )}
        </div>
    );
};

export default LiveScore;
