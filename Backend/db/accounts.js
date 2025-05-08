import pool from "./index.js";

const getUserCurrentPassword = async (userId) => {
  try {
    const response = await pool.query(
      `SELECT user_id, password, temporary_password FROM users WHERE user_id = $1`,
      [userId]
    );
    if (response.rowCount <= 0)
      return { success: false, message: "No account was found" };
    return { success: true, message: response.rows };
  } catch (error) {
    return { success: false, message: error };
  }
};

const changePassword = async (newPassword, userId) => {
  try {
    const response = await pool.query(
      `UPDATE users SET password = $1, temporary_password = $1 WHERE user_id = $2`,
      [newPassword, userId]
    );

    if (response.rowCount <= 0)
      return { success: false, message: "Failed to update password" };
    return { success: true, message: "Successfully updated password" };
  } catch (error) {
    return { success: false, message: error };
  }
};

export { getUserCurrentPassword, changePassword };
