

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Topbar from "./components/Topbar"; 

const socket = io("http://localhost:8000");

function App() {
    const [liveData, setLiveData] = useState(null);
    const [isConnected, setIsConnected] = useState(false); // track the connection

    useEffect(() => {
        // update state when socket connects or disconnects
        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));
        socket.on("updateDashboard", (data) => setLiveData(data.payload));

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("updateDashboard");
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
            <Topbar isConnected={isConnected} />

            {/* The rest of your dashboard content goes here */}
        </div>
    );
}

export default App;
