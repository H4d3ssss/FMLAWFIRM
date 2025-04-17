import pool from "./index.js";

const insertTask = async (data) => {
  try {
    const response = await pool.query(
      `INSERT INTO tasks (task_description, deadline, due_date, day_to_be_finished, task_status, assigned) VALUES (
	$1, '11:59 PM', $2, $3, 'In Progress', $4
)`,
      [data.taskDescription, data.dueDate, data.day, data.dateCreated]
    );
    return { success: true, response: response };
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
WHERE task_status = 'In Progress'`);
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: false, response: "No in progress tasks" };
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
      return { success: false, response: "No unfinished tasks" };
    }
  } catch (error) {
    return { response: false, error };
  }
};

const markAsFinishedTask = async (task_id) => {
  try {
    const response = await pool.query(
      `UPDATE tasks SET task_status = 'Finished' WHERE task_id = $1`,
      [task_id]
    );
    console.log(response);
    return { success: response.rowCount > 0, response };
  } catch (error) {
    return { success: fakse, error };
  }
};

const markAsDeletedTask = async (task_id) => {
  try {
    const response = await pool.query(
      `UPDATE tasks SET task_status = 'Deleted' WHERE task_id = $1`,
      [task_id]
    );
    console.log(response);
    return { success: response.rowCount > 0, response };
  } catch (error) {
    return { success: fakse, error };
  }
};

export {
  insertTask,
  fetchInProgressTasks,
  fetchUnfinishedTasks,
  markAsFinishedTask,
  markAsDeletedTask,
};
