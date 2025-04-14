import express from "express";
import axios from "axios";
import {
  ifClientExist,
  insertClient,
  ifClientExistAndForApproval,
  ifClientExistAndApproved,
  fetchClientsViaEmail,
  generateTemporaryClientPassword,
} from "../db/clients.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/resetpassword", async (req, res) => {
  try {
    const { email } = req.body;
    const response = await generateTemporaryClientPassword(email);
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/signup", async (req, res) => {
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
      !data.contactNumber.trim() ||
      !data.sex.trim()
    ) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }
    console.log(data);
    const clientExist = await ifClientExist(data.email);
    const clientExistAndForApproval = await ifClientExistAndForApproval(
      data.email
    );
    if (clientExist) {
      if (clientExistAndForApproval) {
        return res.status(202).json({ message: "Wait for admin's approval" });
      }
      return res.status(409).json({ error: "Email already exists" });
    }

    if (data.password !== data.confirmPassword) {
      return res.status(400).json({ error: "Password dont match" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const response = await insertClient(data);

    if (response.success) {
      return res.status(200).json({ message: "Wait for admin's approval" });
    } else {
      res
        .status(500)
        .json({ message: "failed to add client", error: response.error.stack });
    }
  } catch (err) {
    console.log(err.stack);
    res
      .status(500)
      .json({ message: "An error has occured while inserting client" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const data = req.body;

    const response = await ifClientExist(data.email);

    if (response) {
      const forApproval = await ifClientExistAndForApproval(data.email);
      if (forApproval) {
        return res.status(409).json({ message: "Wait for admin's approval" });
      }
      const responseApproved = await ifClientExistAndApproved(data.email);
      if (responseApproved) {
        const user = await fetchClientsViaEmail(data.email);
        const validated = await bcrypt.compare(
          data.password,
          user.response[0].password
        );
        if (validated) {
          return res.status(200).json({ message: "You are logged in" });
        } else {
          return res.status(400).json({ message: "Wrong credentials" });
        }
      }
    }
    return res.status(401).json({ message: "Email is not registered yet" });
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ error: error });
  }
});
router.post("/logout", async (req, res) => {
  // this should clear out the cookies in the browser
  // also i havent added a function that'll generate a token in the login route (should i also add in the sign up route?)
  // i stil think that they arent needed yet sooo.....
});

export default router;
