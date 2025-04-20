import pool from "./index.js";

const userExist = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * 
FROM users u
LEFT JOIN clients c ON u.user_id = c.user_id
LEFT JOIN lawyers l ON u.user_id = l.user_id
WHERE u.email = $1`,
      [email]
    );

    if (response.rowCount > 0) {
      return { success: true, response: response.rows };
    } else {
      return {
        success: false,
        message: "Bad Credentials : Email non existing",
      };
    }
  } catch (error) {
    return { error };
  }
};

export { userExist };
