import express from "express";
import {
  insertLawyer,
  fetchLawyers,
  ifLawyerExist,
  fetchActiveLawyers,
  updateLawyer,
  archiveLawyer,
} from "../db/adminSide/lawyers.js";
import bcrypt from "bcrypt";

const router = express.Router();

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
    const { lawyerId } = req.body;
    const response = await archiveLawyer(lawyerId);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/update-lawyer", async (req, res) => {
  try {
    const data = req.body;
    const response = await updateLawyer(data);
    console.log(response);
    if (!response.success) return res.status(500).json(response.message);

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
