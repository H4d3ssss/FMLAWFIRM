import express from "express";
import { fetchInProgressTasks, insertTodayTasks } from "../db/tasks.js";
const router = express.Router();

router.post("/create-today-task", async (req, res) => {
  try {
    const data = req.body;
    const response = await insertTodayTasks(data);
    if (response.success) {
      res.status(200).json({ success: response.response.rowCount > 0 });
    } else {
      res.status(500).json({ success: false, error: response.error.detail });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.get("/fetch-inprogress-tasks", async (req, res) => {
  try {
    const response = await fetchInProgressTasks();
    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json(response.response);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
