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
      ` INSERT INTO appointments (
        client_id, lawyer_id, appointment_date,
        event_title, type_of_event, notes,
        location, start_time, end_time, appointment_status
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, 'Scheduled'
    );`,
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

    return {
      success: true,
      message: "successfully created an appointment and an activity log",
    };
  } catch (error) {
    return { success: false, error };
  }
};
const insertAppointmentForClient = async (data) => {
  try {
    const response = await pool.query(
      ` INSERT INTO appointments (
        client_id, appointment_date,
        event_title, type_of_event, notes,
        location, start_time, end_time, appointment_status
    ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, 'For Approval'
    );`,
      [
        // data.caseId,
        data.clientId,
        data.appointmentDate,
        data.eventTitle,
        data.typeOfEvent,
        data.notes,
        data.location,
        data.startTime,
        data.endTime,
      ]
    );
    console.log(response);
    // console.log("dito ko sa line 57 sa appointments.js");

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
    const response = await pool.query(
      `SELECT * FROM "viewAppointments" WHERE appointment_status = 'Scheduled'`
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchAppointmentsForApproval = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewAppointmentsForApproval"`
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const acceptAppointment = async (appointmentId) => {
  try {
    const response = await pool.query(
      `UPDATE appointments SET appointment_status = 'Scheduled' WHERE appointment_id = $1`,
      [appointmentId]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "Hindi nakapag approve" };
    return { success: true, message: "Approved" };
  } catch (error) {
    return { error };
  }
};
const cancelAppointment = async (appointmentId) => {
  try {
    const response = await pool.query(
      `UPDATE appointments SET appointment_status = 'Cancelled' WHERE appointment_id = $1`,
      [appointmentId]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "Hindi nakapag cancel" };
    return { success: true, message: "Cancelled" };
  } catch (error) {
    return { error };
  }
};

const fetchTodayAppointmentByClientId = async (clientId) => {
  try {
    const response = await pool.query(
      `
SELECT 
  a.*,
  TO_CHAR(a.start_time, 'HH12:MI AM') AS formatted_start_time,
  TO_CHAR(a.end_time, 'HH12:MI AM') AS formatted_end_time,
  TO_CHAR(a.appointment_date, 'Month DD, YYYY') AS formatted_date,
  ul.first_name || ' ' || ul.last_name AS lawyer_name,
  uc.first_name || ' ' || uc.last_name  AS client_name
FROM appointments a
JOIN lawyers l ON a.lawyer_id = l.lawyer_id
JOIN users ul ON l.user_id = ul.user_id
JOIN clients c ON a.client_id = c.client_id
JOIN users uc ON c.user_id = uc.user_id
WHERE a.appointment_date = CURRENT_DATE AND c.client_id = $1
  AND a.end_time > CURRENT_TIME
ORDER BY a.start_time ASC
LIMIT 1;`,
      [clientId]
    ); // if ever related din yung mga clients sa outside events, magagamit tuh

    if (response.rowCount <= 0) return { success: false };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
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
  ul.first_name || ' ' || ul.last_name AS lawyer_name,
  uc.first_name || ' ' || uc.last_name  AS client_name
FROM appointments a
JOIN lawyers l ON a.lawyer_id = l.lawyer_id
JOIN users ul ON l.user_id = ul.user_id
JOIN clients c ON a.client_id = c.client_id
JOIN users uc ON c.user_id = uc.user_id
WHERE a.appointment_date = CURRENT_DATE
  AND a.end_time > CURRENT_TIME
ORDER BY a.start_time ASC
LIMIT 1;`); // if ever related din yung mga clients sa outside events, magagamit tuh

    if (response.rowCount <= 0) return { success: false };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};

const fetchSoonestAppointmentByClientId = async (clientId) => {
  try {
    const response = await pool.query(
      `SELECT 
  a.*, 
  c.*, 
  u.first_name || ' ' || u.last_name AS client_name,  
  u.email AS client_email,
  TO_CHAR(a.appointment_date, 'Month DD, YYYY') AS formatted_date,
  TO_CHAR(a.start_time, 'HH12:MI PM') AS formatted_start_time,
  TO_CHAR(a.end_time, 'HH12:MI PM') AS formatted_end_time,
  ul.first_name || ' ' || ul.last_name AS lawyer_name
FROM appointments a

JOIN clients c ON a.client_id = c.client_id  
JOIN users u ON c.user_id = u.user_id 

-- join the lawyer table and its corresponding user record
JOIN lawyers l ON a.lawyer_id = l.lawyer_id
JOIN users ul ON l.user_id = ul.user_id

WHERE a.appointment_date > CURRENT_TIMESTAMP AND c.client_id = $1
ORDER BY a.appointment_date ASC
LIMIT 1;`,
      [clientId]
    );
    if (response.rowCount <= 0)
      return { success: false, response: "No upcoming event" };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};
const fetchSoonestAppointment = async () => {
  try {
    const response = await pool.query(`SELECT 
  a.*, 
  c.*, 
  u.first_name || ' ' || u.last_name AS client_name,  
  u.email AS client_email,
  TO_CHAR(a.appointment_date, 'Month DD, YYYY') AS formatted_date,
  TO_CHAR(a.start_time, 'HH12:MI PM') AS formatted_start_time,
  TO_CHAR(a.end_time, 'HH12:MI PM') AS formatted_end_time,
  ul.first_name || ' ' || ul.last_name AS lawyer_name
FROM appointments a

JOIN clients c ON a.client_id = c.client_id  
JOIN users u ON c.user_id = u.user_id 

-- join the lawyer table and its corresponding user record
JOIN lawyers l ON a.lawyer_id = l.lawyer_id
JOIN users ul ON l.user_id = ul.user_id

WHERE a.appointment_date > CURRENT_TIMESTAMP
ORDER BY a.appointment_date ASC
LIMIT 1;
`);
    if (response.rowCount <= 0)
      return { success: false, response: "No upcoming event" };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};

const fetchAppointmentById = async (appointmentId) => {
  try {
    const response = await pool.query(
      `SELECT * FROM appointments WHERE appointmend_id = $1`,
      [appointmentId]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "walang na fetch na appointment" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { error };
  }
};

const updateAppointment = async (data, adminId) => {
  try {
    const response = await pool.query(
      `UPDATE appointments SET event_title = $1, type_of_event = $2, client_id = $3, lawyer_id = $4, location = $5, notes = $6, start_time = $7, end_time = $8 WHERE appointment_id = $9`,
      [
        data.title,
        data.type,
        data.clientId,
        data.lawyerId,
        data.location,
        data.notes,
        data.startTime,
        data.endTime,
        data.appointmentId,
      ]
    );
    if (response.rowCount <= 0)
      return {
        success: false,
        message: "something is wrong in updating appointment",
      };
    const data1 = {
      adminId,
      action: "EDITED AN APPOINTMENT",
      description: "Edited an appointment of: ",
      targetTable: "clients",
      target_id: data.clientId,
    };
    await createActivityLog(data1);
    return {
      success: true,
      message: "successfully updated appointment",
    };
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
  fetchAppointmentById,
  updateAppointment,
  fetchTodayAppointmentByClientId,
  fetchSoonestAppointmentByClientId,
  insertAppointmentForClient,
  fetchAppointmentsForApproval,
  acceptAppointment,
  cancelAppointment,
};
