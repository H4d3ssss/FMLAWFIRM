import pool from "./index.js";

const fetchOpenCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewOpenCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchClosedCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewClosedCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchOngoingCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewOngoingCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

export { fetchOpenCases, fetchClosedCases, fetchOngoingCases };
