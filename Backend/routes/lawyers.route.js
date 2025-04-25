import express from "express";
import {
  insertLawyer,
  fetchLawyers,
  ifLawyerExist,
  fetchActiveLawyers,
  updateLawyer,
  archiveLawyer,
  fetchArchivedLawyers,
  restoreArchivedLawyer,
} from "../db/adminSide/lawyers.js";
import bcrypt from "bcrypt";
import { createActivityLog } from "../db/activities.js";

const router = express.Router();

router.patch("/restore-archived-lawyer", async (req, res) => {
  try {
    const { lawyerId } = req.body;
    const adminId = req.session.user.lawyerId;
    const response = await restoreArchivedLawyer(lawyerId, adminId);
    if (!response.success) return res.status(400).json(response.message);
    return res.status(200).json(response.message);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/archived-lawyers", async (req, res) => {
  try {
    const response = await fetchArchivedLawyers();
    if (!response.success) res.send(400).json(response.message);
    res.status(200).json(response.message);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (
      // !data.firstName.trim() ||
      // !data.lastName.trim() ||
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.email.trim() ||
      !data.password.trim() ||
      !data.confirmPassword.trim() ||
      !data.address.trim() ||
      !data.position.trim()
      // !data.address.trim() ||
      // !data.sex.trim() ||
      // !data.dateOfBirth.trim() ||
      // !data.contactNumber.trim() ||
      // !data.barNumber.trim() ||
      // !data.specialization.trim()
    ) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const lawyerExists = await ifLawyerExist(data.email);
    if (lawyerExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (data.password !== data.confirmPassword) {
      return res.status(400).json({ error: "Password dont match" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const response = await insertLawyer(data);

    if (response.success) {
      const data1 = {
        adminId: data.adminId,
        action: "CREATED AN ADMIN",
        description: "Created an admin: " + data.email,
        targetTable: "lawyers",
        target_id: null,
      };
      const response1 = await createActivityLog(data1);
      console.log(response1);
      res.status(201).json({
        message: "successfully added lawyer",
      });
    } else {
      res.status(500).json({
        message: "Failed to add lawyer",
        error: response.error.stack,
      });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: "Server error while adding lawyer" });
  }
});

router.patch("/archive-lawyer", async (req, res) => {
  try {
    const { lawyerId, adminId } = req.body;
    const response = await archiveLawyer(lawyerId);

    const data1 = {
      adminId,
      action: "ARCHIVED AN ADMIN",
      description: "Archived Admin ID: " + lawyerId,
      targetTable: "lawyers",
      target_id: lawyerId,
    };
    const response1 = await createActivityLog(data1);
    console.log(response1);

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/update-lawyer", async (req, res) => {
  try {
    const data = req.body;
    const response = await updateLawyer(data);
    // console.log(response);
    if (!response.success) return res.status(500).json(response.message);

    const data1 = {
      adminId: data.adminId,
      action: "UPDATED AN ADMIN",
      description: "Updated an admin: " + data.email,
      targetTable: "lawyers",
      target_id: data.userId,
    };
    const response1 = await createActivityLog(data1);
    console.log(response1);

    res.status(200).json(response.message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await fetchLawyers();

    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json({ message: "Failed to fetch lawyers" });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: "Server error while fetching lawyers" });
  }
});

router.get("/active-lawyers", async (req, res) => {
  try {
    const data = req.body;
    const response = await fetchActiveLawyers();
    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json(response.response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
