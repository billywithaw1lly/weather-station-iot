import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { initializeSockets } from "./sockets/index.js";
import Reading from "./models/reading.models.js";

dotenv.config({ path: "./.env" });

const server = http.createServer(app);

// app.use(express.json());

// Get list of unique stations in the database
app.get("/api/stations", async (req, res) => {
  try {
    const stations = await Reading.distinct("stationId");
    res.json(stations);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json([]);
  }
});

// Get historical data strictly filtered by stationId
app.get("/api/history", async (req, res) => {
  const { stationId } = req.query;
  if (!stationId) return res.status(400).json({ error: "Station ID required" });

  try {
    const history = await Reading.find({ stationId })
      .sort({ timestamp: -1 })
      .limit(2900)
      .lean();

    const chronological = history.reverse();
    // Sample every 29th reading to keep charts fast
    const sampledHistory = chronological.filter((_, index) => index % 29 === 0);

    //const formattedHistory = chronological.map((doc) => ({
    const formattedHistory = sampledHistory.map((doc) => ({
      ...doc,
      ...doc.payload,
      timestamp: new Date(doc.timestamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json([]);
  }
});

// NEW: Endpoint for the physical Arduino to send data to
// app.post("/api/telemetry", async (req, res) => {
//   try {
//     const { stationId, payload } = req.body;

//     if (!stationId || !payload) {
//       return res.status(400).json({ error: "Missing stationId or payload" });
//     }

//     // 1. Save the real hardware reading to MongoDB
//     const newReading = await Reading.create({
//       stationId,
//       payload,
//     });

//     // 2. Broadcast it to your React frontend via Socket.io instantly!
//     // (Assuming you have access to your 'io' instance here, or use your socket manager)
//     req.app.get("io").emit("updateDashboard", { stationId, payload });

//     res.status(201).json({ success: true, message: "Data received" });
//   } catch (error) {
//     console.error("Hardware Data Error:", error);
//     res.status(500).json({ error: "Failed to process hardware data" });
//   }
// });


connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;
    initializeSockets(server);
    server.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
