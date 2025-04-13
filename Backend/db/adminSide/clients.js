import pool from "../index.js";

const fetchClientsForApproval = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewClients" WHERE account_status = 'For Approval'`
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export { fetchClientsForApproval };
