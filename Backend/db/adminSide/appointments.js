import pool from "../index.js";

const fetchScheduledAppointments = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewScheduledAppointments"`
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchCompletedAppointments = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewCompletedAppointments"`
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchCancelledAppointments = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewCancelledAppointments"`
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

export {
  fetchScheduledAppointments,
  fetchCompletedAppointments,
  fetchCancelledAppointments,
};
