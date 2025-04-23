import express from "express";
import { fetchActivityLogs } from "../db/activities.js";

const router = express.Router();

router.get(`/fetch-activities`, async (req, res) => {
  try {
    const response = await fetchActivityLogs();
    if (!response.success) return res.status(300).json(response.message);

    return res.status(200).json(response.message);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
