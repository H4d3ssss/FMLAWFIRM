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

const sendAppointmentStatus = async (appointment) => {
  try {
    const mailOptions = {
      from: `"F&M Law Firm" <bialen.jv.distor@gmail.com>`,
      to: appointment.email,
      subject: "Appointment Reminder",
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #2c3e50;">Appointment Reminder</h2>
        <p>Hi <strong>${appointment.first_name} ${
        appointment.last_name
      }</strong>,</p>
        <p>This is a friendly reminder that you have an upcoming appointment scheduled on:</p>
        <div style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; margin: 15px 0;">
          <p><strong>Date:</strong> ${new Date(
            appointment.appointment_date
          ).toDateString()}</p>
          <p><strong>Time:</strong> ${appointment.start_time} - ${
        appointment.end_time
      }</p>
          <p><strong>Location:</strong> ${
            appointment.location || "F&M Law Firm"
          }</p>
        </div>
        <p>Please arrive 10-15 minutes early. If you need to reschedule, feel free to contact us.</p>
        <p>Thank you,<br>F&M Law Firm</p>
        <hr style="margin-top: 30px;">
        <small style="color: #888;">This is an automated message. Please do not reply directly to this email.</small>
      </div>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendAppointmentStatus;
