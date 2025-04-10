import express from "express";

import {
  fetchScheduledAppointments,
  fetchCompletedAppointments,
  fetchCancelledAppointments,
} from "../db/appointments.js";

const router = express.Router();

router.get("/scheduled", async (req, res) => {
  try {
    const response = await fetchScheduledAppointments();
    if (response.success) {
      res.status(200).json(response);
    } else {
      res
        .status(500)
        .json({ message: "failed fetching scheduled appointments" });
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({
      message:
        "an error has occured in the server while fething scheduled appointments",
    });
  }
});

router.get("/completed", async (req, res) => {
  try {
    const response = await fetchCompletedAppointments();
    if (response.success) {
      res.status(200).json(response);
    } else {
      res
        .status(500)
        .json({ message: "failed fetching completed appointments" });
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({
      message:
        "an error has occured in the server while fething completed appointments",
    });
  }
});

router.get("/cancelled", async (req, res) => {
  try {
    const response = await fetchCancelledAppointments();
    if (response.success) {
      res.status(200).json(response);
    } else {
      res
        .status(500)
        .json({ message: "failed fetching scheduled appointments" });
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({
      message:
        "an error has occured in the server while fething cancelled appointments",
    });
  }
});

export default router;
