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
JOIN clients c
ON a.target_id = c.client_id
JOIN users u
ON c.user_id = u.user_id
JOIN lawyers l
ON a.admin_id = l.lawyer_id
JOIN users u1
ON u1.user_id = l.user_id`);
    if (response.rowCount <= 0)
      return { success: false, message: "HINDI ITUH PODI, no activity logs" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { error };
  }
};

export { fetchActivityLogs };
