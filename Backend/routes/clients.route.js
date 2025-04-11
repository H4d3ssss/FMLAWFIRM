import express from "express";
import {
  fetchClients,
  insertClient,
  fetchClient,
  ifClientExist,
  fetchClientsViaEmail,
} from "../db/clients.js";
import bcrypt from "bcrypt";
import generateToken from "./auth.route.js";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetchClients();

    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ message: "fetched clients failed" });
    }
  } catch (err) {
    console.log(err.stack);
    res
      .status(500)
      .json({ message: "An error has occured while fetching clients" });
  }
});

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
      !data.dateOfBirth.trim()
    ) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const clientExist = await ifClientExist(data.email);
    console.log(clientExist);
    if (clientExist) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if (data.password !== data.confirmPassword) {
      return res.status(400).json({ error: "Password dont match" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    const response = await insertClient(data);

    if (response.success) {
      const response = await fetchClientsViaEmail(data.email);
      const newUser = {
        id: response.response[0].client_id,
        email: response.response[0].email,
      };
      console.log(newUser);
      generateToken(newUser, res);
      res.status(200).json({ message: "successfully added a client" });
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

router.post("/one", async (req, res) => {
  try {
    const { clientId } = req.body;
    const response = await fetchClient(clientId);
    if (response.success) {
      res.status(200).json(response);
    } else {
      res.status(500).json({ message: "failed to fetch certain client" });
    }
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ error: err });
  }
});

export default router;
