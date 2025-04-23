import { createActivityLog } from "./activities.js";
import pool from "./index.js";

const insertTask = async (data) => {
  try {
    const response = await pool.query(
      `INSERT INTO tasks (task_description, deadline, due_date, day_to_be_finished, task_status, assigned) VALUES (
	$1, '11:59 PM', $2, $3, 'In Progress', $4
)`,
      [data.taskDescription, data.dueDate, data.day, data.dateCreated]
    );

    if (response.rowCount <= 0)
      return { success: false, response: "Hindi nakapagset ng task huy" };

    const data1 = {
      adminId: data.adminId,
      action: "CREATED TASK",
      description: "Created a task: " + data.taskDescription,
      targetTable: "tasks",
      target_id: null,
    };

    const response1 = await createActivityLog(data1);
    // console.log(response1);
    if (!response1.success)
      return {
        success: false,
        message: "may mali sa pag create ng activity log",
      };

    return {
      success: true,
      response: "nakapag create ng task at create ng activity log",
    };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

const fetchInProgressTasks = async () => {
  try {
    const response = await pool.query(`SELECT task_id,
	task_description,
	deadline,
	due_date,
	day_to_be_finished,
	assigned,
	created_at,
	task_status
FROM tasks  
WHERE task_status = 'In Progress' ORDER BY due_date ASC`);
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: true, message: "No in progress tasks", response: [] };
    }
  } catch (error) {
    return { response: false, error };
  }
};

const fetchUnfinishedTasks = async () => {
  try {
    const response = await pool.query(`
SELECT 
  task_id,
	task_description,
	deadline,
	due_date,
	day_to_be_finished,
	assigned,
	created_at,
	task_status,
	DATE(due_date) AS due_date_only
FROM tasks  
WHERE task_status = 'Unfinished'`);
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: true, message: "No in progress tasks", response: [] };
    }
  } catch (error) {
    return { response: false, error };
  }
};

const markAsFinishedTask = async (task_id, adminId) => {
  try {
    const response2 = await pool.query(
      `SELECT * FROM tasks WHERE task_id = $1`,
      [task_id]
    );

    const response = await pool.query(
      `UPDATE tasks SET task_status = 'Finished' WHERE task_id = $1`,
      [task_id]
    );
    if (response.rowCount <= 0)
      return {
        success: false,
        message: "may error sa pag mark as finished task",
      };
    console.log(adminId);
    const data1 = {
      adminId: adminId,
      action: "UPDATED TASK",
      // description:
      //   "Marked as finished task: " + response2.rows[0].task_description,
      description:
        response2.rows[0].task_status === "Unfinished"
          ? "Unfinished task marked as finished task: " +
            response2.rows[0].task_description
          : "Marked as finished task: " + response2.rows[0].task_description,
      targetTable: "tasks",
      target_id: null,
    };

    const response1 = await createActivityLog(data1);

    if (!response1.success)
      return {
        success: false,
        message:
          "May error sa pag create ng activity log sa mark as finished  ",
      };

    return { success: response.rowCount > 0, response };
  } catch (error) {
    return { success: fakse, error };
  }
};

const markAsDeletedTask = async (task_id, adminId) => {
  try {
    const response2 = await pool.query(
      `SELECT * FROM tasks WHERE task_id = $1`,
      [task_id]
    );

    const response = await pool.query(
      `UPDATE tasks SET task_status = 'Deleted' WHERE task_id = $1`,
      [task_id]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "May error sa pag delete ng task" };

    const data1 = {
      adminId: adminId,
      action: "DELETED TASK",
      // description: "Deleted a task: " + response2.rows[0].task_description,
      description:
        response2.rows[0].task_status === "Unfinished"
          ? "Deleted an unfinished task: " + response2.rows[0].task_description
          : "Deleted a task: " + response2.rows[0].task_description,
      targetTable: "tasks",
      target_id: null,
    };

    const response1 = await createActivityLog(data1);
    console.log(response1);
    if (!response1.success)
      return {
        success: false,
        message: "May error sa pag create ng activity log sa delete task",
      };
    // console.log(response);
    return { success: response.rowCount > 0, response };
  } catch (error) {
    return { success: fakse, error };
  }
};

const markAsUnfinishedTask = async (task_id) => {
  try {
    const response = await pool.query(
      `UPDATE tasks SET task_status = 'Unfinished' WHERE task_id = $1`,
      [task_id]
    );
    // console.log(response);
    return { success: response.rowCount > 0, response };
  } catch (error) {
    return { success: fakse, error };
  }
};

const fetchTasksDueDateToday = async () => {
  try {
    const response = await pool.query(`SELECT 
  task_id,
  task_description,
  deadline,
  due_date,
  day_to_be_finished,
  assigned,
  created_at,
  task_status
FROM tasks  
WHERE task_status = 'In Progress'
  AND due_date = CURRENT_DATE;`);

    if (response.rowCount <= 0) return { success: false };

    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};

export {
  insertTask,
  fetchInProgressTasks,
  fetchUnfinishedTasks,
  markAsFinishedTask,
  markAsDeletedTask,
  markAsUnfinishedTask,
  fetchTasksDueDateToday,
};
