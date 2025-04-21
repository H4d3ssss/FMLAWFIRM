import express from "express";

import {
  fetchScheduledAppointments,
  fetchCompletedAppointments,
  fetchCancelledAppointments,
  insertAppointment,
  fetchAppointments,
  fetchTodayAppointment,
  fetchSoonestAppointment,
} from "../db/adminSide/appointments.js";

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

router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const response = await insertAppointment(data);
    console.log(response);
    if (response.success) {
      res.status(200).json({
        sucess: true,
        message: "Successfully scheduled an appointment",
      });
    } else {
      res.status(500).json({ success: false, message: "Failed Appointment" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await fetchAppointments();
    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json({ message: "failed fetching appointments" });
    }
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({
      message: "an error has occured in the server while fething appointments",
    });
  }
});

router.get("/soonest-appointment", async (req, res) => {
  try {
    const response = await fetchTodayAppointment();
    if (response.success) {
      return res.status(200).json(response.response);
    }

    const response1 = await fetchSoonestAppointment();

    if (response1.success) {
      return res.status(200).json(response.response);
    }

    res.status(200).json({ response: response1.response });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
