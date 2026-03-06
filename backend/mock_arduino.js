import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

// The IDs must match your Topbar stations EXACTLY
const stationIds = ["STN-MOCK-01", "STN-INDORE-04", "STN-KOLKATA-02"];

socket.on("connect", () => {
  console.log("🚀 Multi-Station Mock Arduino Connected!");

  setInterval(() => {
    stationIds.forEach((id) => {
      const fakeData = {
        stationId: id, // Dynamically set the ID for each broadcast
        payload: {
          temp: parseFloat((Math.random() * (35 - 20) + 20).toFixed(1)),
          humidity: Math.floor(Math.random() * (90 - 40) + 40),
          pressure: parseFloat(
            (Math.random() * (1020 - 1000) + 1000).toFixed(1),
          ),
          // Differentiate data slightly so you can see the change
          altitude:
            id === "STN-INDORE-04"
              ? 553.0
              : id === "STN-KOLKATA-02"
                ? 9.0
                : 250.5,
          airQuality: Math.floor(Math.random() * (200 - 50) + 50),
          rain: Math.floor(Math.random() * 1024),
        },
      };

      socket.emit("sensorData", fakeData);
    });

    console.log(
      `📡 Transmitted telemetry for: ${stationIds.join(", ")} at ${new Date().toLocaleTimeString()}`,
    );
  }, 30000);
});

socket.on("disconnect", () => {
  console.log("🔴 Connection lost.");
});
