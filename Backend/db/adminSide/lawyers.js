import { createActivityLog } from "../activities.js";
import pool from "../index.js";

const fetchLawyers = async () => {
  const query = `SELECT * FROM "viewLawyers" WHERE account_status = 'Active' ORDER BY lawyer_id ASC`;
  try {
    const response = await pool.query(query);
    return { success: true, response: response.rows };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

const restoreArchivedLawyer = async (lawyerId, adminId) => {
  try {
    const response = await pool.query(
      `UPDATE lawyers SET account_status = 'Active' WHERE lawyer_id = $1`,
      [lawyerId]
    );
    if (response.rowCount <= 0)
      return { success: false, message: "Restore failed" };

    const data1 = {
      adminId,
      action: "RESTORED ARCHIVED ADMIN",
      description: "Restored Admin: ",
      targetTable: "lawyers",
      target_id: lawyerId,
    };
    console.log(data1);
    const response1 = await createActivityLog(data1);
    console.log(response1);
    return { success: true, message: "Restore success" };
  } catch (error) {
    return { error };
  }
};

const fetchArchivedLawyers = async () => {
  try {
    const response = await pool.query(`SELECT u.*, l.*
FROM lawyers l
JOIN users u ON l.user_id = u.user_id
WHERE l.account_status = 'Archived';`);
    if (response.rowCount <= 0)
      return { success: false, message: "None archived lawyers" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { error };
  }
};

const updateLawyer = async (data) => {
  try {
    const response = await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2
       WHERE user_id = $3;`,
      [data.firstName, data.lastName, data.userId]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "No rows updated in users table" };

    const response1 = await pool.query(
      `UPDATE lawyers
       SET account_status = $1,
           position = $2
       WHERE user_id = $3;`,
      [data.accountStatus, data.position, data.userId]
    );

    if (response1.rowCount <= 0)
      return { success: false, message: "No rows updated in lawyers table" };

    return { success: true, message: "Successfully updated lawyer" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

const archiveLawyer = async (lawyerId) => {
  try {
    const response = await pool.query(
      `UPDATE lawyers SET account_status = 'Archived' WHERE lawyer_id = $1`,
      [lawyerId]
    );
    return { response };
  } catch (error) {
    return { error };
  }
};

const ifLawyerExist = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewLawyers" WHERE email = $1`,
      [email]
    );
    // console.log(response.rowCount);
    return response.rowCount;
  } catch (error) {
    console.log(error.stack);
  }
};

const insertLawyer = async (data) => {
  const query = `WITH new_user AS (
    INSERT INTO users (
      first_name, last_name, email, password, address, role
    )
    VALUES (
      $1, $2, $3, $4, $5, 'Lawyer'
    )
    RETURNING user_id, role
  )
  INSERT INTO lawyers (user_id, account_status, position, specialization)
  SELECT user_id, 'Active', $6, $7 FROM new_user WHERE role = 'Lawyer';`;
  try {
    const response = await pool.query(query, [
      data.firstName,
      data.lastName,
      data.email,
      data.password, // hash natin to
      data.address,
      data.position,
      data.specialization,
    ]);
    return { success: response.rowCount > 0 };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

const fetchActiveLawyers = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewLawyers" WHERE account_status = 'Active'`
    );

    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: false, response: "No active lawyers were found" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

export {
  insertLawyer,
  fetchLawyers,
  ifLawyerExist,
  fetchActiveLawyers,
  updateLawyer,
  archiveLawyer,
  fetchArchivedLawyers,
  restoreArchivedLawyer,
};
