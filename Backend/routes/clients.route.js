import express from "express";
import {
  fetchClients,
  fetchClient,
  ifClientExist,
  fetchClientsViaEmail,
} from "../db/clients.js";

import { fetchClientsForApproval } from "../db/adminSide/clients.js";

const router = express.Router();

router.get("/clientsforapproval", async (req, res) => {
  try {
    const response = await fetchClientsForApproval();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

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
