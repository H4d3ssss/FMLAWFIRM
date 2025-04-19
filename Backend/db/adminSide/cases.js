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

const insertNewCase = async (
  caseTitle,
  clientId,
  lawyerId,
  status,
  fileName,
  filePath
) => {
  try {
    const response = await pool.query(
      `WITH new_case AS (
  INSERT INTO cases (case_title, client_id, lawyer_id, case_status)
  VALUES ($1, $2, $3, $4)
  RETURNING case_id
)

INSERT INTO documents (case_id, file_name, file_path)
SELECT case_id, $5, $6
FROM new_case;`,
      [caseTitle, clientId, lawyerId, status, fileName, filePath]
    );
    return {
      success: response.rowCount > 0,
      response: response.rows,
    };
  } catch (error) {
    return { success: false, error };
  }
};

const fetchAllCases = async () => {
  try {
    const response = await pool.query(`SELECT * FROM "viewAllCases"`);

    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: true, message: "No cases" };
    }
  } catch (error) {
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
  insertNewCase,
  fetchAllCases,
};
