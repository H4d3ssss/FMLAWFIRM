import pool from "./index.js";

const fetchActivityLogs = async () => {
  try {
    const response = await pool.query(`SELECT
  a.log_id,
  a.action,
  a.description,
  a.target_table,
  TO_CHAR(a.timestamp, 'YYYY-MM-DD, HH12:MI PM') AS timestamp,

  -- target name depending on type of table
  CASE 
    WHEN a.target_table = 'clients' THEN u.first_name || ' ' || u.last_name
    WHEN a.target_table = 'lawyers' THEN u2.first_name || ' ' || u2.last_name
    WHEN a.target_table = 'cases' THEN cs.case_title
    ELSE NULL
  END AS target_name,

  -- admin who made the action
  u1.first_name || ' ' || u1.last_name AS admin_name,

  -- target's user_id or null if it's a case
  COALESCE(u.user_id, u2.user_id) AS user_id,

  -- include case title as a separate field
  cs.case_id

FROM activity_logs a

-- if target is a client
LEFT JOIN clients c ON a.target_table = 'clients' AND a.target_id = c.client_id
LEFT JOIN users u ON c.user_id = u.user_id

-- if target is a lawyer
LEFT JOIN lawyers l2 ON a.target_table = 'lawyers' AND a.target_id = l2.lawyer_id
LEFT JOIN users u2 ON l2.user_id = u2.user_id

-- if target is a case
LEFT JOIN cases cs ON a.target_table = 'cases' AND a.target_id = cs.case_id

-- admin who performed the action
JOIN lawyers l ON a.admin_id = l.lawyer_id
JOIN users u1 ON l.user_id = u1.user_id

ORDER BY a.log_id DESC;`);
    // console.log(response.rowCount);
    // console.log(response.rowCount);
    if (response.rowCount <= 0)
      return { success: false, message: "HINDI ITUH PODI, no activity logs" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { error };
  }
};

const createActivityLog = async (data) => {
  try {
    const response = await pool.query(
      `INSERT INTO activity_logs
(admin_id, action, description, target_table, target_id) 
VALUES 
($1, $2, $3, $4, $5)`,
      [
        data.adminId,
        data.action,
        data.description,
        data.targetTable,
        data.target_id, // dapat targetId, peru omki nah siguro muna yan para toloy toloy dev
      ]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "Failed to create an activity log" };

    return { success: true, message: "Created activity log successfully" };
  } catch (error) {
    return { error };
  }
};

export { fetchActivityLogs, createActivityLog };
