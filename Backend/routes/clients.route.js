import express from "express";
import {
  fetchClients,
  fetchClient,
  ifClientExist,
  fetchClientsViaEmail,
  fetchApprovedClients,
  updateArchiveClient,
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

router.get("/approved-clients", async (req, res) => {
  try {
    const response = await fetchApprovedClients();

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

router.patch("/archive-client", async (req, res) => {
  try {
    const { client_id } = req.body;
    const response = await updateArchiveClient(client_id);
    if (!response.success) return res.status(401).json(response.response);
    return res.status(200).json(response.response);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
