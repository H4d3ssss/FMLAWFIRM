import pool from "./index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
const fetchClient = async (clientId) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients1" WHERE client_id = $1`,
      [clientId]
    );
    return { success: true, response: response.rows };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

const fetchClients = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewClients1"
WHERE account_status != 'Archived'
ORDER BY 
  CASE 
    WHEN account_status = 'Approved' THEN 0 
    ELSE 1 
  END;
`);
    return { success: true, response: response.rows };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

const fetchClientsViaEmail = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients" WHERE email = $1`,
      [email]
    );
    return { success: true, response: response.rows };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

const insertClient = async (data) => {
  const query = `CALL insert_client($1, $2, $3, $4, $5, $6, $7, $8)`;
  try {
    const response = await pool.query(query, [
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.address,
      data.dateOfBirth,
      data.contactNumber,
      data.sex,
    ]);
    return { success: true };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

const ifClientExistAndForApproval = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients" WHERE email = $1 AND account_status = 'For Approval'`,
      [email]
    );
    return response.rowCount;
  } catch (error) {
    console.log(error.stack);
  }
};
const ifClientExistAndApproved = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients" WHERE email = $1 AND account_status = 'Approved'`,
      [email]
    );
    return response.rowCount;
  } catch (error) {
    console.log(error.stack);
  }
};

const validatePasswordOrTemporaryPassword = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients" WHERE email = $1`,
      [email]
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

const generateTemporaryClientPassword = async (email) => {
  const isApproval = await ifClientExistAndForApproval(email);
  const isApproved = await ifClientExistAndApproved(email);
  const isExist = await fetchClientsViaEmail(email);

  if (!isExist.success || isExist.response.length === 0) {
    return { message: "Email doesn't exist" };
  }

  if (isApproval > 0) {
    return { message: "You are not registered yet, wait for admin's approval" };
  }

  if (isApproved > 0) {
    const unhashedTemporaryPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(unhashedTemporaryPassword, 10);
    try {
      await pool.query(
        `UPDATE users SET temporary_password = $1 WHERE email = $2`,
        [hashedPassword, email]
      );
      return {
        message: "Temporary password has been set",
        temporaryPassword: unhashedTemporaryPassword,
        fullName: isExist.response[0].full_name,
      };
    } catch (error) {
      console.log("Database error:", error);
      return { message: "An error occurred while updating the password" };
    }
  }

  return { message: "Account found but status is not approved" };
};

const ifClientExist = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients" WHERE email = $1`,
      [email]
    );
    return response.rowCount;
  } catch (error) {
    console.log(error.stack);
  }
};

const fetchApprovedClients = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients1" WHERE account_status = 'Approved'`
    );
    if (response.rowCount <= 0)
      return { success: false, response: "No Approved Clients" };
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
  }
};

const updateArchiveClient = async (clientId) => {
  try {
    const response = await pool.query(
      "UPDATE clients SET account_status = 'Archived' WHERE client_id = $1",
      [clientId]
    );
    if (response.rowCount <= 0)
      return { success: false, response: "Update Failed" };
    return { success: true, response: "Updated Successfully" };
  } catch (error) {
    console.log(error);
  }
};

const updateClientDetails = async (data) => {
  try {
    const response = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, contact_number = $3 WHERE user_id = $4`,
      [data.first_name, data.last_name, data.contact_number, data.user_id]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "may error sa response" };

    const response1 = await pool.query(
      `UPDATE clients SET account_status = $1 WHERE client_id = $2`,
      [data.status, data.client_id]
    );

    if (response1.rowCount <= 0)
      return { success: false, message: "error sa response 2" };
    return { success: true, message: "NAKAPAGUPDATE KA NG CLIENTS HIHIHI" };
  } catch (error) {
    return { error };
  }
};

const updateClientDetails1 = async (data) => {
  try {
    const response = await pool.query(
      `UPDATE users SET first_name = $1, last_name = $2, date_of_birth = $3, sex = $4, contact_number = $5, address = $6 WHERE user_id = $7`,
      [
        data.firstName,
        data.lastName,
        data.birthDate,
        data.sex,
        data.contact_number,
        data.fullAddress,
        data.user_id,
      ]
    );
    console.log(response);
    if (response.rowCount <= 0)
      return { success: false, message: "hindi nakapag update" };

    return { success: true, message: "nakapag update" };
  } catch (error) {
    return { error };
  }
};

export {
  fetchClients,
  insertClient,
  fetchClient,
  ifClientExistAndForApproval,
  ifClientExist,
  fetchClientsViaEmail,
  ifClientExistAndApproved,
  generateTemporaryClientPassword,
  validatePasswordOrTemporaryPassword,
  fetchApprovedClients,
  updateArchiveClient,
  updateClientDetails,
  updateClientDetails1,
};
