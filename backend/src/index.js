import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http";
import { initializeSockets } from "./sockets/index.js";

// Load environment variables as early as possible
dotenv.config({
  path: "./.env",
});

// Create an HTTP server (Required for Socket.io later)
const server = http.createServer(app);

// Connect to MongoDB, then start the server
connectDB()
  .then(() => {
    const PORT = process.env.PORT || 8000;

    initializeSockets(server);

    // Listen on the HTTP server, NOT the express app directly
    server.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
