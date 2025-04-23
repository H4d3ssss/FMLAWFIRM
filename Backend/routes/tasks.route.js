import express from "express";
import {
  fetchInProgressTasks,
  insertTask,
  fetchUnfinishedTasks,
  markAsFinishedTask,
  markAsDeletedTask,
  markAsUnfinishedTask,
  fetchTasksDueDateToday,
} from "../db/tasks.js";
const router = express.Router();

router.post("/create-today-task", async (req, res) => {
  try {
    const data = req.body;
    const response = await insertTask(data);
    if (response.success) {
      res.status(200).json({ success: response.response.rowCount > 0 });
    } else {
      res.status(500).json({ success: false, error: response.error.detail });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post("/create-tomorrow-task", async (req, res) => {
  try {
    const data = req.body;
    const response = await insertTask(data);
    if (response.success) {
      res.status(200).json({ success: response.response.rowCount > 0 });
    } else {
      res.status(500).json({ success: false, error: response.error.detail });
    }
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

router.post("/create-week-task", async (req, res) => {
  try {
    const data = req.body;
    const response = await insertTask(data);
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

router.get("/fetch-unfinished-tasks", async (req, res) => {
  try {
    const response = await fetchUnfinishedTasks();
    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json(response.response);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.patch("/mark-finished-task", async (req, res) => {
  try {
    const { taskId } = req.body;
    const response = await markAsFinishedTask(taskId);

    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json(response.error);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error at updating task as finished task",
      error: error,
    });
  }
});

router.patch("/mark-deleted-task", async (req, res) => {
  try {
    const { taskId } = req.body;
    const response = await markAsDeletedTask(taskId);

    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json(response.error);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error at updating task as finished task",
      error: error,
    });
  }
});

router.patch("/mark-unfinished-task", async (req, res) => {
  try {
    const { taskId } = req.body;
    const response = await markAsUnfinishedTask(taskId);

    if (response.success) {
      res.status(200).json(response.response);
    } else {
      res.status(500).json(response.error);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error at updating task as finished task",
      error: error,
    });
  }
});

router.get("/tasks-due-today", async (req, res) => {
  try {
    const response = await fetchTasksDueDateToday();
    if (!response.success)
      return res.status(200).json({ response: "No tasks for today" });
    console.log(response.response);
    res.status(200).json(response.response);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
