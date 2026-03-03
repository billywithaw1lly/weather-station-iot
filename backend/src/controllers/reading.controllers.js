import Reading from "../models/reading.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getHistoricalReadings = asyncHandler(async (req, res) => {
  // 1. Get the stationId from the query URL (e.g., ?stationId=STN-MOCK-01)
  const { stationId } = req.query;

  // Default to a limit of 50 data points if the frontend doesn't specify one
  const limit = parseInt(req.query.limit) || 50;

  if (!stationId) {
    return res
      .status(400)
      .json({ success: false, message: "stationId is required" });
  }

  // 2. Query MongoDB
  const history = await Reading.find({ stationId: stationId })
    .sort({ timestamp: -1 }) // -1 means descending (newest first)
    .limit(limit);

  // 3. Return the data to the frontend using our standard format
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        history,
        `Fetched last ${history.length} readings for ${stationId}`,
      ),
    );
});
