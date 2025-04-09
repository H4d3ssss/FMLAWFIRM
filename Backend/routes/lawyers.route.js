import express from "express";
import { insertLawyer, fetchLawyers, ifLawyerExist } from "../db/lawyers.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.email.trim() ||
      !data.password.trim() ||
      !data.confirmPassword.trim() ||
      !data.address.trim() ||
      !data.dateOfBirth.trim() ||
      !data.barNumber.trim() ||
      !data.specialization.trim()
    ) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const lawyerExists = await ifLawyerExist(data.email);
    console.log(lawyerExists);
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

router.get("/", async (req, res) => {
  try {
    const response = await fetchLawyers();

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ message: "Failed to fetch lawyers" });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ message: "Server error while fetching lawyers" });
  }
});

export default router;
