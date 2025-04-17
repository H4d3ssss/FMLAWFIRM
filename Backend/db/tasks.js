import pool from "./index.js";

const insertTodayTasks = async (data) => {
  try {
    const response = await pool.query(
      `INSERT INTO tasks (task_description, deadline, due_date, day_to_be_finished, task_status) VALUES (
	$1, '11:59 PM', $2, $3, 'In Progress'
)`,
      [data.taskDescription, data.dueDate, data.day]
    );
    return { success: true, response: response };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

const fetchInProgressTasks = async () => {
  try {
    const response = await pool.query(`SELECT 
	task_description,
	deadline,
	due_date,
	day_to_be_finished,
	task_status
FROM tasks WHERE task_status = 'In Progress'`);
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: false, response: "No in progress tasks" };
    }
  } catch (error) {
    return { response: false, error };
  }
};

export { insertTodayTasks, fetchInProgressTasks };
