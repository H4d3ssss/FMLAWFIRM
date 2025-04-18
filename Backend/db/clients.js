import pool from "./index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
const fetchClient = async (clientId) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients" WHERE client_id = $1`,
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
    const response = await pool.query(`SELECT * FROM "viewClients"`);
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
      `SELECT * FROM "viewClients" WHERE account_status = 'Approved'`
    );
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: false, response: "No Approved Clients" };
    }
  } catch (error) {
    console.log(error.stack);
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
};
