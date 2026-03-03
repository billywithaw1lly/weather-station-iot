import express from "express";
import cors from "cors";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import readingRouter from "./routes/reading.routes.js";

const app = express();

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// Middleware to parse incoming JSON payloads from the Arduino
app.use(express.json({ limit: "16kb" }));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Serve static files from the public folder
app.use(express.static("public"));

// --- Routes will be imported and mounted here later ---
// import healthcheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/readings", readingRouter);
// app.use("/api/v1/healthcheck", healthcheckRouter);

export { app };
