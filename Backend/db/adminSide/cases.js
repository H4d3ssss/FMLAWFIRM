import { createActivityLog } from "../activities.js";
import pool from "../index.js";

const fetchActiveCases = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewAllCases2" WHERE case_status = 'Active'`
    );
    return { success: true, response: response.rows };
  } catch (error) {
    console.log(error.stack);
    return { success: false, error };
  }
};

const fetchActiveCasesByClientId = async (clientId) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewAllCases2" WHERE case_status = 'Active' AND client_id = $1`,
      [clientId]
    );
    if (response.rowCount <= 0) return { success: false, message: 0 };
    return { success: true, message: response.rowCount };
  } catch (error) {
    return { error };
  }
};

const fetchClosedCasesByClientId = async (clientId) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewAllCases2" WHERE case_status = 'Closed' AND client_id = $1`,
      [clientId]
    );
    if (response.rowCount <= 0) return { success: false, message: 0 };
    return { success: true, message: response.rowCount };
  } catch (error) {
    return { error };
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
    const response = await pool.query(
      `SELECT * FROM "viewAllCases2" WHERE case_status = 'Pending'`
    );
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

const fetchArchivedCases1 = async () => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewAllCases2" WHERE case_status = 'Archived'`
    );
    if (response.rowCount <= 0)
      return { success: false, message: "No archived cases" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { error };
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
  caseDescription,
  clientId,
  lawyerId,
  status,
  fileName,
  filePath,
  adminId,
  party
) => {
  try {
    const response = await pool.query(
      `WITH new_case AS (
  INSERT INTO cases (case_title, party, case_description, client_id, lawyer_id, case_status)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING case_id
)

INSERT INTO documents (case_id, file_name, file_path)
SELECT case_id, $7, $8
FROM new_case;`,
      [
        caseTitle,
        party,
        caseDescription,
        clientId,
        lawyerId,
        status,
        fileName,
        filePath,
      ]
    );
    const data1 = {
      adminId,
      action: "CREATED CASE",
      description: "Created a new case for",
      targetTable: "clients",
      target_id: clientId,
    };
    const response1 = await createActivityLog(data1);

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
      `SELECT * FROM "viewAllCases2" WHERE case_status != 'Archived' ORDER BY case_id DESC`
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

const fetchCaseByClientId = async (clientId) => {
  try {
    const response = await pool.query(
      `
SELECT * FROM "viewAllCases2" WHERE client_id = $1`,
      [clientId]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "No case for the client" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { error };
  }
};

const fetchCaseByCaseId = async (case_id) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewAllCases2" WHERE case_id = $1`,
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
  // console.log(data.lawyerId);
  console.log(data.party);
  const response3 = await pool.query(
    // this fetches the old data before it'll change
    `SELECT * FROM "viewAllCases2" WHERE case_id = $1`,
    [data.caseId]
  );
  // return console.log(response3.rows[0].case_id);
  const query1 = `UPDATE cases
SET case_title = $1,
    case_status = $2,
    case_description = $5,
    last_update = NOW(),
    updated_by = $3,
    party = $6
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
      data.caseDescription,
      data.party,
    ]);
    const response1 = await pool.query(query2, [
      data.fileName,
      data.filePath,
      data.caseId,
    ]);

    // console.log(response);

    const oldCaseTitle = response3.rows[0].case_title;
    const oldCaseStatus = response3.rows[0].case_status;
    const oldFileName = response3.rows[0].file_name;
    const oldCaseDescription = response3.rows[0].case_description;
    const oldParty = response3.rows[0].party;

    const data1 = {
      adminId: data.lawyerId,
      action: "EDITED A CASE",
      description: "",
      targetTable: "cases",
      target_id: data.caseId,
    };

    // Five changes: title, status, file, description, and party
    if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case title, case narratives, case status, file name, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Four changes combinations with party
    else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case title, case status, file name, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus &&
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case title, case status, case narratives, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case title, file name, case narratives, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case status, file name, case narratives, party) : FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Original four changes without party
    else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription
    ) {
      data1.description =
        "Changes are (case title, case narratives, case status, file name) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Three changes combinations with party
    else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case title, case status, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldFileName !== data.fileName &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case title, file name, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case status, file name, party) : FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case title, case narratives, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseStatus !== data.caseStatus &&
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case status, case narratives, party) : FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (file name, case narratives, party) : FROM " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Original three changes combinations without party
    else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName
    ) {
      data1.description =
        "Changes are (case title, case status, file name) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus &&
      oldCaseDescription !== data.caseDescription
    ) {
      data1.description =
        "Changes are (case title, case status, case narratives) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription
    ) {
      data1.description =
        "Changes are (case title, file name, case narratives) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription
    ) {
      data1.description =
        "Changes are (case status, file name, case narratives) : FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Two changes combinations with party
    else if (oldCaseTitle !== data.caseTitle && oldParty !== data.party) {
      data1.description =
        "Changes are (case title, party) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (oldCaseStatus !== data.caseStatus && oldParty !== data.party) {
      data1.description =
        "Changes are (case status, party) : FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (oldFileName !== data.fileName && oldParty !== data.party) {
      data1.description =
        "Changes are (file name, party) : FROM " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseDescription !== data.caseDescription &&
      oldParty !== data.party
    ) {
      data1.description =
        "Changes are (case narratives, party) : FROM " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Original two changes combinations without party
    else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseStatus !== data.caseStatus
    ) {
      data1.description =
        "Changes are (case title, case status) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldFileName !== data.fileName
    ) {
      data1.description =
        "Changes are (case title, file name) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseStatus !== data.caseStatus &&
      oldFileName !== data.fileName
    ) {
      data1.description =
        "Changes are (case status, file name) : FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldFileName +
        " TO " +
        data.fileName +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseTitle !== data.caseTitle &&
      oldCaseDescription !== data.caseDescription
    ) {
      data1.description =
        "Changes are (case title, case narratives) : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldCaseStatus !== data.caseStatus &&
      oldCaseDescription !== data.caseDescription
    ) {
      data1.description =
        "Changes are (case status, case narratives) : FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (
      oldFileName !== data.fileName &&
      oldCaseDescription !== data.caseDescription
    ) {
      data1.description =
        "Changes are (file name, case narratives) : FROM " +
        oldFileName +
        " TO " +
        data.fileName +
        ", " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Single changes
    else if (oldCaseTitle !== data.caseTitle) {
      data1.description =
        "Change is case title : FROM " +
        oldCaseTitle +
        " TO " +
        data.caseTitle +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (oldCaseStatus !== data.caseStatus) {
      data1.description =
        "Change is case status: FROM " +
        oldCaseStatus +
        " TO " +
        data.caseStatus +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (oldFileName !== data.fileName) {
      data1.description =
        "Change is file name : FROM " +
        oldFileName +
        " TO " +
        data.fileName +
        ", (Case ID: " +
        data.caseId +
        ")";
    } else if (oldCaseDescription !== data.caseDescription) {
      data1.description =
        "Change is case narratives : FROM " +
        oldCaseDescription +
        " TO " +
        data.caseDescription +
        ", (Case ID: " +
        data.caseId +
        ")";
    }
    // Added single change for party
    else if (oldParty !== data.party) {
      data1.description =
        "Change is party : FROM " +
        oldParty +
        " TO " +
        data.party +
        ", (Case ID: " +
        data.caseId +
        ")";
    }

    // console.log(response);

    const response2 = await createActivityLog(data1);
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return { success: true, response: "Failed to update" };
    }
  } catch (error) {
    console.log(error);
    return { error };
  }
};

const archiveCase = async (caseId, adminId) => {
  try {
    const response = await pool.query(
      `UPDATE cases SET case_status = 'Archived', last_update = NOW(), updated_by = $2 WHERE case_id = $1`,
      [caseId, adminId]
    );

    const data1 = {
      adminId,
      action: "ARCHIVED A CASE",
      description: "Archived case ID: " + caseId,
      targetTable: "cases",
      target_id: caseId,
    };

    const response2 = await createActivityLog(data1);

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

const restoreArchivedCase = async (caseId, adminId) => {
  console.log(caseId);
  console.log(adminId);
  try {
    const response = await pool.query(
      `UPDATE cases SET case_status = 'Active', last_update = NOW(), updated_by = $2 WHERE case_id = $1`,
      [caseId, adminId]
    );
    console.log(response);
    if (response.rowCount <= 0)
      return { success: false, message: "failed to restore archived client" };

    const data1 = {
      adminId,
      action: "RESTORED CASE",
      description: "Restored Case: ",
      targetTable: "cases",
      target_id: caseId,
    };
    // console.log(data1);
    const response3 = await createActivityLog(data1);
    return { success: true, message: "Successfully restored archived client" };
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
  fetchArchivedCases1,
  restoreArchivedCase,
  fetchActiveCasesByClientId,
  fetchClosedCasesByClientId,
  fetchCaseByClientId,
};
