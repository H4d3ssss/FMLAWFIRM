import express from "express";

import {
  fetchScheduledAppointments,
  fetchCompletedAppointments,
  fetchCancelledAppointments,
  insertAppointment,
  fetchAppointments,
  fetchTodayAppointment,
  fetchSoonestAppointment,
  fetchAppointmentById,
  updateAppointment,
  fetchTodayAppointmentByClientId,
  fetchSoonestAppointmentByClientId,
  insertAppointmentForClient,
  fetchAppointmentsForApproval,
  acceptAppointment,
  cancelAppointment,
} from "../db/adminSide/appointments.js";
import { createActivityLog } from "../db/activities.js";

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
    // console.log(data);
    const response = await insertAppointment(data);
    // query here the email of the client so that i can send the email once the admin creates an appointment
    const adminId = req.session.user.lawyerId;
    const data1 = {
      adminId,
      action: "CREATED APPOINTMENT",
      description: "Created an appointment for",
      targetTable: "clients",
      target_id: data.clientId,
    };

    const response1 = await createActivityLog(data1);
    console.log(data1);
    console.log("im here");
    if (!response1.success)
      return res
        .status(200)
        .json({ success: false, message: "may problema sa response 1" });
    // console.log(response);
    if (response.success) {
      res.status(200).json({
        success: true,
        message: "Successfully scheduled an appointment",
      });
    } else {
      res.status(500).json({ success: false, message: "Failed Appointment" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/appointment-for-client", async (req, res) => {
  try {
    const data = req.body;
    // console.log(data);
    const response = await insertAppointmentForClient(data);

    if (response.success) {
      res.status(200).json({
        success: true,
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

router.get("/for-approval", async (req, res) => {
  try {
    const response = await fetchAppointmentsForApproval();
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

router.patch("/approve-appointment", async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const response = await acceptAppointment(appointmentId);
    if (!response.success) res.status(400).json(response.message);
    res.status(200).json(response.message);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/cancel-appointment", async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const response = await cancelAppointment(appointmentId);
    if (!response.success) res.status(400).json(response.message);
    res.status(200).json(response.message);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/soonest-appointment", async (req, res) => {
  try {
    const response = await fetchTodayAppointment();
    if (response.success) {
      return res.status(200).json(response.response);
    }
    // console.log(response);
    const response1 = await fetchSoonestAppointment();
    // console.log(response1.response[0]);
    if (response1.success) {
      return res.status(200).json(response1.response);
    }

    res.status(200).json({ response: response1.response });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/soonest-appointment-client", async (req, res) => {
  try {
    const clientId = req.session.user.clientId;
    const response = await fetchTodayAppointmentByClientId(clientId);
    if (response.success) {
      return res.status(200).json(response.response);
    }
    // console.log(response);
    const response1 = await fetchSoonestAppointmentByClientId(clientId);
    // console.log(response1.response[0]);
    if (response1.success) {
      return res.status(200).json(response1.response);
    }

    res.status(200).json({ response: response1.response });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/appointment-by-id", async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const response = await fetchAppointmentById(appointmentId);

    if (!response.success) res.status(400).json(response.message);
    res.status(200).json(response.message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/update-appointment", async (req, res) => {
  try {
    const data = req.body;
    const adminId = req.session.user.lawyerId;
    // console.log(data);
    const response = await updateAppointment(data, adminId);

    if (!response.success) res.status(400).json(response.message);
    res.status(200).json(response.message);
  } catch (error) {
    console.log(error);
  }
});

export default router;
