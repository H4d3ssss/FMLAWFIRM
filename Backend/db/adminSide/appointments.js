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
        // data.caseId,
        data.clientId,
        data.lawyerId,
        data.appointmentDate,
        data.eventTitle,
        data.typeOfEvent,
        data.notes,
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

const fetchAppointments = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewAppointments"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchTodayAppointment = async () => {
  try {
    const response =
      await pool.query(`SELECT *, TO_CHAR(start_time, 'HH12:MI AM') as formatted_start_time,TO_CHAR(end_time, 'HH12:MI AM') as formatted_end_time
FROM appointments
WHERE appointment_date = CURRENT_DATE;`);

    if (response.rowCount <= 0) return { success: false };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};

const fetchSoonestAppointment = async () => {
  try {
    const response = await pool.query(`SELECT *
FROM appointments
WHERE appointment_date > CURRENT_TIMESTAMP
ORDER BY appointment_date ASC
LIMIT 1;  `);
    if (response.rowCount <= 0)
      return { success: false, response: "No upcoming event" };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};

export {
  fetchScheduledAppointments,
  fetchCompletedAppointments,
  fetchCancelledAppointments,
  insertAppointment,
  fetchAppointments,
  fetchTodayAppointment,
  fetchSoonestAppointment,
};
