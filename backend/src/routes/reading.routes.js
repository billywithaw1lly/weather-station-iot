import { Router } from "express";
import { getHistoricalReadings } from "../controllers/reading.controllers.js";

const router = Router();

// When a GET request hits /history, run the controller
router.route("/history").get(getHistoricalReadings);

export default router;
