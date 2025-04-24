import { createActivityLog, fetchActivityLogs } from "../activities.js";
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
    // console.log("dito ko sa line 57 sa appointments.js");
    // console.log(response);

    const data1 = {
      adminId: data.adminId,
      action: "CREATED APPOINTMENT",
      description: "Created an appointment for",
      targetTable: "appointment",
      target_id: data.clientId,
    };

    const response1 = await createActivityLog(data1);

    if (!response1.success)
      return { success: false, message: "may problema sa response 1" };

    return {
      success: true,
      message: "successfully created an appointment and an activity log",
    };
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
    const response = await pool.query(`
SELECT 
  a.*,
  TO_CHAR(a.start_time, 'HH12:MI AM') AS formatted_start_time,
  TO_CHAR(a.end_time, 'HH12:MI AM') AS formatted_end_time,
  TO_CHAR(a.appointment_date, 'Month DD, YYYY') AS formatted_date,
  ul.first_name AS lawyer_name,
  uc.first_name AS client_name
FROM appointments a
JOIN lawyers l ON a.lawyer_id = l.lawyer_id
JOIN users ul ON l.user_id = ul.user_id
JOIN clients c ON a.client_id = c.client_id
JOIN users uc ON c.user_id = uc.user_id
WHERE a.appointment_date = CURRENT_DATE
  AND a.end_time > CURRENT_TIME
ORDER BY a.start_time ASC
LIMIT 1;;`); // if ever related din yung mga clients sa outside events, magagamit tuh

    if (response.rowCount <= 0) return { success: false };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};

const fetchSoonestAppointment = async () => {
  try {
    const response = await pool.query(`SELECT *
, TO_CHAR(appointment_date, 'Month DD, YYYY') AS formatted_date
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
