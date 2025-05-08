import express from "express";
import bcrypt from "bcrypt";
import { changePassword, getUserCurrentPassword } from "../db/accounts.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const userId = req.session.user.userId;
    const { inputCurrentPassword } = req.body;
    const response = await getUserCurrentPassword(userId);

    if (!response.success) return res.status(401).json(response.message);

    const currentPassword = response.message[0].password;
    const temporaryPassword = response.message[0].temporary_password;
    const validate = await bcrypt.compare(
      inputCurrentPassword,
      currentPassword
    );

    const validate1 = await bcrypt.compare(
      inputCurrentPassword,
      temporaryPassword || ""
    );

    if (!validate && !validate1) return res.status(401).json(false);

    res.status(200).json(true);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/change-password", async (req, res) => {
  try {
    const userId = req.session.user.userId;

    const { inputCurrentPassword, newPassword } = req.body;
    const response = await getUserCurrentPassword(userId);
    if (!response.success) return res.status(401).json(response.message);

    const currentPassword = response.message[0].password;
    const temporaryPassword = response.message[0].temporary_password;
    const validate = await bcrypt.compare(
      inputCurrentPassword,
      currentPassword
    );

    const validate1 = await bcrypt.compare(
      inputCurrentPassword,
      temporaryPassword || ""
    );

    if (!validate && !validate1)
      return res.status(401).json({ message: "Current password isnt correct" });

    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await changePassword(newHashedPassword, userId);

    if (!result.success) return res.status(401).json(result.message);

    res.status(200).json(result.message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default router;
