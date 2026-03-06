import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Topbar from "./components/Topbar";
import LiveSummary from "./components/LiveSummary";

const socket = io("http://localhost:8000");

function App() {
    // 1. State is perfectly clean. Just the array and the connection status.
    const [dataHistory, setDataHistory] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isDark, setIsDark] = useState(true);
    

    // 2. Fetch the initial 30 minutes on load
    // Inside App.jsx
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/history",
                );

                // SAFETY NET: If the backend fails, stop right here!
                if (!response.ok) {
                    throw new Error(`Server Error: ${response.status}`);
                }

                const history = await response.json();
                setDataHistory(history);
            } catch (error) {
                console.error("Failed to fetch initial history:", error);
                // By failing gracefully, dataHistory remains an empty []
                // and the WebSockets won't crash the app!
            }
        };
        fetchInitialData();
    }, []);

    let socketMessageCount = 0;
    useEffect(() => {
        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));

        socket.on("updateDashboard", (data) => {
            socketMessageCount++;

            // Only update the graph every 12th message (6 minutes)
            // This keeps the 6-hour scale consistent with the historical data
            if (socketMessageCount % 12 === 0) {
                setDataHistory((prevHistory) => {
                    const newReading = data.payload || data;
                    const readingWithTime = {
                        ...newReading,
                        timestamp: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    };

                    const updatedArray = [...prevHistory, readingWithTime];
                    return updatedArray.slice(-60); // Keep exactly 60 dots (6 hours)
                });
            }
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("updateDashboard");
        };
    }, []); // Removed the ';' from before the comma // Fixed the syntax error here (removed the extra semicolon/bracket combo)

    // ... rest of your state and useEffects remain exactly as you have them ...

    return (
        /* 1. This wrapper triggers Tailwind's dark mode across the entire app */
        <div className={isDark ? "dark" : ""}>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
                {/* 2. Pass theme props to Topbar to enable the toggle switch */}
                <Topbar
                    isConnected={isConnected}
                    isDark={isDark}
                    setIsDark={setIsDark}
                />

                <main className="pt-6">
                    {/* 3. Pass isDark to LiveSummary to toggle the AQI line color */}
                    <LiveSummary dataHistory={dataHistory} isDark={isDark} />
                </main>
            </div>
        </div>
    );
}

export default App;
