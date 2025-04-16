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

const insertAppointment = async (data) => {
  try {
    const response = await pool.query(
      `CALL insert_appointment($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        data.caseId,
        data.clientId,
        data.lawyerId,
        data.appointmentDate,
        "Scheduled",
        data.purpose,
        data.location,
        data.startTime,
        data.endTime,
      ]
    );
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
};

export {
  fetchScheduledAppointments,
  fetchCompletedAppointments,
  fetchCancelledAppointments,
  insertAppointment,
};
