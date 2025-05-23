import pool from "./index.js";

const userExist = async (email) => {
  try {
    const response = await pool.query(
      `SELECT 
  u.user_id,
  u.email,
  u.role,
  u.password,
  u.temporary_password,
  l.lawyer_id,
  c.client_id,
  u.role
FROM users u
LEFT JOIN clients c ON u.user_id = c.user_id
LEFT JOIN lawyers l ON u.user_id = l.user_id
WHERE u.email = $1
  AND (c.account_status = 'Approved' OR l.account_status = 'Active'); `,
      [email]
    );
    // console.log(response);
    console.log(response.rowCount);
    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return {
        success: false,
        message: "Email non existing",
      };
    }
  } catch (error) {
    return { error };
  }
};

export { userExist };
