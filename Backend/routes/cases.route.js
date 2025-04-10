import express from "express";
import {
  fetchOpenCases,
  fetchClosedCases,
  fetchOngoingCases,
} from "../db/cases.js";
const router = express.Router();

router.get("/open", async (req, res) => {
  try {
    const response = await fetchOpenCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(500).json({ message: "Fetching open cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage: "An error has occured in the server while fetching open cases",
    });
  }
});

router.get("/closed", async (req, res) => {
  try {
    const response = await fetchClosedCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(500).json({ message: "Fetching closed cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching closed cases",
    });
  }
});

router.get("/ongoing", async (req, res) => {
  try {
    const response = await fetchOngoingCases();

    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(500).json({ message: "Fetching ongoing cases failed" });
    }
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({
      messsage:
        "An error has occured in the server while fetching ongoing cases",
    });
  }
});

export default router;
