import { Server } from "socket.io";
import Reading from "../models/reading.models.js";

export const initializeSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("sensorData", async (data) => {
      console.log("Live Data Received from Station:", data.stationId);

      // Broadcast this exact data to the React dashboard instantly
      io.emit("updateDashboard", data);

      try {
        const newReading = new Reading({
          stationId: data.stationId,
          payload: data.payload, // Contains temp, humidity, altitude, etc.
        });

        await newReading.save();
        console.log("Saved reading to MongoDB!");
      } catch (error) {
        console.error("Failed to save reading to DB:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};
