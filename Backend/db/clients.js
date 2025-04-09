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

const insertClient = async (data) => {
  const query = `CALL insert_client($1, $2, $3, $4, $5, $6)`;
  try {
    const response = await pool.query(query, [
      data.firstName,
      data.lastName,
      data.email,
      data.password,
      data.address,
      data.dateOfBirth,
    ]);
    return { success: true };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

export { fetchClients, insertClient, fetchClient };
