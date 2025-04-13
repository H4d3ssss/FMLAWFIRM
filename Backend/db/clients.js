import pool from "./index.js";

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

export {
  fetchClients,
  insertClient,
  fetchClient,
  ifClientExistAndForApproval,
  ifClientExist,
  fetchClientsViaEmail,
  ifClientExistAndApproved,
};
