import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

socket.on("connect", () => {
  console.log("Mock Arduino Connected to Server!");

  setInterval(() => {
    const fakeData = {
      stationId: "STN-MOCK-01",
      payload: {
        temp: parseFloat((Math.random() * (35 - 20) + 20).toFixed(1)),
        humidity: Math.floor(Math.random() * (90 - 40) + 40),
        pressure: parseFloat((Math.random() * (1020 - 1000) + 1000).toFixed(1)),
        altitude: 250.5,
        airQuality: Math.floor(Math.random() * (200 - 50) + 50),
        rain: Math.floor(Math.random() * 1024),
      },
    };
    console.log("Transmitting sensor data...");
    socket.emit("sensorData", fakeData);
  }, 3000);
});

socket.on("disconnect", () => {
  console.log("🔴 Connection lost.");
});
