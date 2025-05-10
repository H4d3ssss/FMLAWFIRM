import pool from "./index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { createActivityLog } from "./activities.js";
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

const fetchClientsForApproval = async () => {
  try {
    const response = await pool.query(`
SELECT * FROM "viewClients1" WHERE account_status = 'For Approval'`);

    if (response.rowCount <= 0)
      return { success: false, message: "walang for approval" };
    return { success: true, response: response.rows };
  } catch (error) {
    return { error };
  }
};

const fetchArchivedClients = async () => {
  try {
    const response =
      await pool.query(`SELECT u.*, C.*, TO_CHAR(u.date_of_birth, 'Month DD, YYYY') as formatted_birthdate
FROM clients c
JOIN users u ON c.user_id = u.user_id
WHERE c.account_status = 'Archived';`);

    if (response.rowCount <= 0)
      return { success: false, message: "No archived clients" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { error };
  }
};

const restoreArchivedClient = async (clientId, adminId) => {
  try {
    const response = await pool.query(
      `UPDATE clients SET account_status = 'Approved' WHERE client_id = $1`,
      [clientId]
    );
    if (response.rowCount <= 0)
      return { success: false, message: "Failed to restore archived client" };

    const data1 = {
      adminId,
      action: "RESTORED CLIENT",
      description: "Restored client: ",
      targetTable: "clients",
      target_id: clientId,
    };
    // console.log(data1);
    const response3 = await createActivityLog(data1);
    return { success: true, message: "Succcessfully restored archived client" };
  } catch (error) {
    return { error };
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
  END,
  client_id DESC;
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
      `SELECT 
  u.*, 
  c.client_id, 
  l.lawyer_id
FROM users u
LEFT JOIN clients c ON u.user_id = c.user_id
LEFT JOIN lawyers l ON u.user_id = l.user_id
WHERE u.email = $1;
`,
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
    // console.log(response.rowCount);
    return response.rowCount;
  } catch (error) {
    console.log(error.stack);
  }
};
const ifClientExistAndApproved = async (email) => {
  try {
    const response = await pool.query(
      `SELECT 
  u.user_id,
  u.first_name,
  u.last_name,
  u.email,
  COALESCE(vc.client_id::TEXT, l.lawyer_id::TEXT) AS account_id,
  COALESCE(vc.account_status::TEXT, l.account_status::TEXT) AS account_status,
  CASE 
    WHEN vc.client_id IS NOT NULL THEN 'client'
    WHEN l.lawyer_id IS NOT NULL THEN 'lawyer'
    ELSE 'unknown'
  END AS role
FROM users u
LEFT JOIN "viewClients1" vc ON u.user_id = vc.user_id
LEFT JOIN lawyers l ON u.user_id = l.user_id
WHERE u.email = $1
  AND (
    vc.account_status IN ('Approved')
    OR l.account_status IN ('Active')
  );`,
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
      // console.log(isExist);
      return {
        message: "Temporary password has been sent",
        temporaryPassword: unhashedTemporaryPassword,
        fullName:
          isExist.response[0].first_name + " " + isExist.response[0].last_name,
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
      `SELECT * FROM "viewClients1" WHERE account_status = 'Approved' ORDER BY client_id DESC`
    );
    if (response.rowCount <= 0)
      return { success: false, response: "No Approved Clients" };
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
  }
};

const updateArchiveClient = async (clientId, adminId) => {
  try {
    const response = await pool.query(
      "UPDATE clients SET account_status = 'Archived' WHERE client_id = $1",
      [clientId]
    );
    if (response.rowCount <= 0)
      return { success: false, response: "Update Failed" };

    const data1 = {
      adminId,
      action: "ARCHIVED CLIENT",
      description: "Archived client: ",
      targetTable: "clients",
      target_id: clientId,
    };
    // console.log(data1);
    const response3 = await createActivityLog(data1);
    // console.log(response3);
    // console.log("nakapag create ng activity log");
    return { success: true, response: "Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const approveClient = async (clientId, adminId) => {
  try {
    const response = await pool.query(
      "UPDATE clients SET account_status = 'Approved' WHERE client_id = $1",
      [clientId]
    );
    if (response.rowCount <= 0)
      return { success: false, response: "Update Failed" };

    const data1 = {
      adminId,
      action: "APPROVED CLIENT",
      description: "Approved client account: ",
      targetTable: "clients",
      target_id: clientId,
    };
    // console.log(data1);
    const response3 = await createActivityLog(data1);
    // console.log(response3);
    return { success: true, response: "Updated Successfully" };
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const cancelClient = async (clientId, adminId) => {
  try {
    const response = await pool.query(
      "UPDATE clients SET account_status = 'Cancelled' WHERE client_id = $1",
      [clientId]
    );
    if (response.rowCount <= 0)
      return { success: false, response: "Update Failed" };

    const data1 = {
      adminId,
      action: "CANCELLED CLIENT",
      description: "Cancelled account approval: ",
      targetTable: "clients",
      target_id: clientId,
    };
    // console.log(data1);
    const response3 = await createActivityLog(data1);
    // console.log(response3);
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

    const data1 = {
      adminId: data.adminId,
      action: "UPDATED CLIENT",
      description: "Updated client: ",
      targetTable: "clients",
      target_id: data.client_id,
    };
    // console.log(data1);
    const response3 = await createActivityLog(data1);
    // console.log(response3);

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
        data.first_name,
        data.last_name,
        data.not_formatted_date_of_birth,
        data.sex,
        data.contact_number,
        data.address,
        data.user_id,
      ]
    );
    // console.log(response);
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
  fetchClientsForApproval,
  approveClient,
  cancelClient,
  fetchArchivedClients,
  restoreArchivedClient,
};
