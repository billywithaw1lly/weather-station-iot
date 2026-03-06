import { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Topbar from "./components/Topbar";
import LiveSummary from "./components/LiveSummary";
import History24h from "./components/History24h";

const socket = io("http://localhost:8000");

function App() {
    const [dataHistory, setDataHistory] = useState([]);
    const [currentReading, setCurrentReading] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isDark, setIsDark] = useState(true);
    const [availableStations, setAvailableStations] = useState([]);
    const [activeStation, setActiveStation] = useState("STN-MOCK-01");

    const messageCounter = useRef(0);

    // 1. Fetch the list of available stations ONLY ONCE on load
    useEffect(() => {
        const fetchStations = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/stations");
                const data = await res.json();
                if (data.length > 0) {
                    setAvailableStations(data);
                    // Optionally auto-select the first station in the DB
                    // setActiveStation(data[0]);
                }
            } catch (error) {
                console.error("Could not fetch stations list", error);
            }
        };
        fetchStations();
    }, []);

    // 2. Fetch the HISTORICAL DATA every time the activeStation changes
    useEffect(() => {
        const fetchInitialData = async () => {
            // Immediate reset to trigger loading/offline state visually
            setCurrentReading(null);
            setDataHistory([]);

            try {
                const response = await fetch(
                    `http://localhost:8000/api/history?stationId=${activeStation}`,
                );
                if (!response.ok) throw new Error("Server Error");
                const history = await response.json();

                setDataHistory(history);
                if (history.length > 0) {
                    setCurrentReading(history[history.length - 1]);
                }
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
        };

        fetchInitialData();
    }, [activeStation]); // Re-runs when you change stations

    // 3. Socket Logic
    useEffect(() => {
        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));

        socket.on("updateDashboard", (data) => {
            const newReading = data.payload || data;
            const incomingStation = newReading.stationId || "STN-MOCK-01";

            // If the socket data isn't for the station we are looking at, ignore it
            if (incomingStation !== activeStation) return;

            const timeOptions = {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            };
            const timestamp = new Date().toLocaleTimeString(
                "en-GB",
                timeOptions,
            );

            setCurrentReading({ ...newReading, timestamp });

            messageCounter.current++;
            if (messageCounter.current % 29 === 0) {
                setDataHistory((prev) =>
                    [...prev, { ...newReading, timestamp }].slice(-100),
                );
            }
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("updateDashboard");
        };
    }, [activeStation]);

    return (
        <Router>
            <div className={isDark ? "dark" : ""}>
                <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
                    <Topbar
                        isConnected={isConnected}
                        activeStation={activeStation}
                        setActiveStation={setActiveStation}
                        isDark={isDark}
                        setIsDark={setIsDark}
                        availableStations={availableStations} // Pass this so Topbar can render them
                    />
                    <main className="pt-6">
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <LiveSummary
                                        currentReading={currentReading}
                                        activeStation={activeStation}
                                        dataHistory={dataHistory} // Added this prop for max/min calculations
                                    />
                                }
                            />
                            <Route
                                path="/history"
                                element={
                                    <History24h
                                        dataHistory={dataHistory}
                                        activeStation={activeStation}
                                        isDark={isDark}
                                    />
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
}

export default App;
