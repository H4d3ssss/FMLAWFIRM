import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import lawyerRoutes from "./routes/lawyers.route.js";
import clientRoutes from "./routes/clients.route.js";
import caseRoutes from "./routes/cases.route.js";
import appointmentRoutes from "./routes/appointments.route.js";
import authRoutes from "./routes/auth.route.js";
import taskRoutes from "./routes/tasks.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));

app.use("/api/lawyers", lawyerRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server running at port ${port}`);
});
