import express from "express";
import { insertLawyer, fetchLawyers } from "../db/lawyers.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const data = req.body;
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
