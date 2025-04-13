import pool from "../index.js";

const fetchLawyers = async () => {
  const query = `SELECT * FROM "viewLawyers"`;
  try {
    const response = await pool.query(query);
    return { success: true, response: response.rows };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

const ifLawyerExist = async (email) => {
  try {
    const response = await pool.query(
      `SELECT * FROM "viewLawyers" WHERE email = $1`,
      [email]
    );
    console.log(response.rowCount);
    return response.rowCount;
  } catch (error) {
    console.log(error.stack);
  }
};

const insertLawyer = async (data) => {
  const query = `WITH new_user AS (
    INSERT INTO users (
      first_name, last_name, email, password, address, sex, date_of_birth, contact_number, role
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, 'Lawyer'
    )
    RETURNING user_id, role
  )
  INSERT INTO lawyers (user_id, bar_number, specialization)
  SELECT user_id, $9, $10 FROM new_user WHERE role = 'Lawyer';`;
  try {
    const response = await pool.query(query, [
      data.firstName,
      data.lastName,
      data.email,
      data.password, // hash natin to
      data.address,
      data.sex,
      data.dateOfBirth,
      data.contactNumber,
      data.barNumber,
      data.specialization,
    ]);
    return { success: response.rowCount > 0 };
  } catch (err) {
    console.log(err.stack);
    return { success: false, error: err };
  }
};

export { insertLawyer, fetchLawyers, ifLawyerExist };
