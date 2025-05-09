import cron from "node-cron";
import pool from "./index.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bialen.jv.distor@gmail.com",
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

cron.schedule("0 12 * * *", async () => {
  console.log("Running daily notification check...");

  try {
    const result =
      await pool.query(`SELECT a.appointment_id, u.first_name, u.last_name, u.email, a.appointment_date, a.location, TO_CHAR(a.start_time, 'HH12: MI PM') AS start_time, TO_CHAR(a.end_time, 'HH12:MI PM') AS end_time
FROM appointments a
JOIN clients c ON a.client_id = c.client_id
JOIN users u ON c.user_id = u.user_id
WHERE DATE(a.appointment_date) = CURRENT_DATE + INTERVAL '1 day';
        `);

    for (const appointment of result.rows) {
      // Example: Send a console log, or integrate email/SMS logic
      const mailOptions = {
        from: `"F&M Law Firm" bialen.jv.distor@gmail.com`,
        to: appointment.email,
        subject: "Appointment Reminder",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #2c3e50;">Appointment Reminder</h2>
      <p>Hi <strong>${appointment.first_name} ${
          appointment.last_name
        }</strong>,</p>
      <p>This is a friendly reminder that you have an upcoming appointment tomorrow:</p>
      
      <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Date:</strong> ${appointment.appointment_date.toDateString()}</p>
        <p><strong>Time:</strong> ${appointment.start_time} - ${
          appointment.end_time
        }</p>
        <p><strong>Location:</strong> ${
          appointment.location ? appointment.location : "F&M Law Firm"
        }</p>
      </div>

      <p>Please arrive 10-15 minutes early.</p>

      <p>Thank you,<br>F&M Law Firm</p>
      
      <hr style="margin-top: 30px;">
      <small style="color: #888;">This is an automated message. Please do not reply directly to this email.</small>
    </div>`,
      };
      await transporter.sendMail(mailOptions);
      console.log("notifications sent");
    }
    console.log("successfully sent");
  } catch (err) {
    console.error("Error running notification cron job:", err);
  }
});
