import pool from "../index.js";

const fetchActiveCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewActiveCases"`);
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

const fetchInProgressCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewInProgressCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchPendingCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewPendingCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchResolvedCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewResolvedCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchOnHoldCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewOnHoldCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchDismissedCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewDismissedCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchArchivedCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewArchivedCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchUnderReviewCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewUnderReviewCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchAwaitingTrialCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewAwaitingTrialCases"`);
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

export {
  fetchActiveCases,
  fetchClosedCases,
  fetchInProgressCases,
  fetchPendingCases,
  fetchResolvedCases,
  fetchOnHoldCases,
  fetchDismissedCases,
  fetchArchivedCases,
  fetchUnderReviewCases,
  fetchAwaitingTrialCases,
};
