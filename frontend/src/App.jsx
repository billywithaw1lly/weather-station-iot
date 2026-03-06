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

    const messageCounter = useRef(0);

    // Initial Data Fetch
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/api/history",
                );
                if (!response.ok) throw new Error("Server Error");
                const history = await response.json();
                setDataHistory(history);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            }
        };
        fetchInitialData();
    }, []);

    // Socket Logic
    useEffect(() => {
        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));

        // Inside App.jsx socket listener
        socket.on("updateDashboard", (data) => {
            const newReading = data.payload || data;

            // 1. Update Live State for all 6 metrics
            setCurrentReading({
                ...newReading,
                timestamp: new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                }),
            });

            // 2. Update 24h History (Every 29th message)
            messageCounter.current++;
            if (messageCounter.current % 29 === 0) {
                setDataHistory((prev) => {
                    const formatted = {
                        ...newReading,
                        timestamp: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    };
                    return [...prev, formatted].slice(-100);
                });
            }
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("updateDashboard");
        };
    }, []);

    return (
        <Router>
            <div className={isDark ? "dark" : ""}>
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
                    <Topbar
                        isConnected={isConnected}
                        isDark={isDark}
                        setIsDark={setIsDark}
                    />

                    <main className="pt-6">
                        <Routes>
                            {/* Live Feed Route */}
                            <Route
                                path="/"
                                element={
                                    <LiveSummary
                                        currentReading={currentReading}
                                        dataHistory={dataHistory}
                                        isDark={isDark}
                                    />
                                }
                            />

                            {/* 24h History Route */}
                            <Route
                                path="/history"
                                element={
                                    <History24h
                                        dataHistory={dataHistory}
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
