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
    const response = await pool.query(
      `SELECT * FROM "viewAllCases2" WHERE case_status != 'Archived'`
    );

    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: true, message: "No cases" };
    }
  } catch (error) {
    return { success: false, error };
  }
};

const fetchCaseByCaseId = async (case_id) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewAllCases" WHERE case_id = $1`,
      [case_id]
    );

    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: true, message: "No cases" };
    }
  } catch (error) {
    return { success: false, error };
  }
};
// WAIT FETCH MUNA DETAISL PARA SA EDIT CASE MODAL PS PA ADD NUNG LAST UPDATED BY AND YUNG NAME
const updateCase = async (data, fileName, filePath) => {
  const query1 = `UPDATE cases
SET case_title = $1,
    case_status = $2,
    last_update = NOW(),
    updated_by = $3
WHERE case_id = $4;`;
  const query2 = `UPDATE documents
SET file_name = $1,
    file_path = $2
WHERE case_id = $3;`;
  try {
    const response = await pool.query(query1, [
      data.caseTitle,
      data.caseStatus,
      data.lawyerId,
      data.caseId,
    ]);
    const response1 = await pool.query(query2, [
      data.fileName,
      data.filePath,
      data.caseId,
    ]);
    console.log(response);
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: true, response: "Failed to update" };
    }
  } catch (error) {
    return { error };
  }
};

const archiveCase = async (caseId) => {
  try {
    const response = await pool.query(
      `UPDATE cases SET case_status = 'Archived' WHERE case_id = $1`,
      [caseId]
    );

    if (response.rowCount > 0) {
      return {
        success: true,
        message: "Successfully arvhived case id: " + caseId,
      };
    } else {
      return { success: false, message: "Case id cannot be found" };
    }
  } catch (error) {
    return { error };
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
  fetchCaseByCaseId,
  updateCase,
  archiveCase,
};
