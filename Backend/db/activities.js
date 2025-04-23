import pool from "./index.js";

const fetchActivityLogs = async () => {
  try {
    const response = await pool.query(`SELECT
	a.log_id,
	a.action,
	a.description,
	a.target_table,
	TO_CHAR(a.timestamp, 'YYYY-MM-DD, HH12:MI PM') AS timestamp,
	u.first_name || ' ' || u.last_name AS client_name,
	u1.first_name || ' ' || u1.last_name AS admin_name,
	u.user_id
FROM activity_logs a
LEFT JOIN clients c
  ON a.target_id = c.client_id
LEFT JOIN users u
  ON c.user_id = u.user_id
JOIN lawyers l
  ON a.admin_id = l.lawyer_id
JOIN users u1
  ON u1.user_id = l.user_id
ORDER BY a.log_id DESC`);
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
