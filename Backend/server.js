import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import lawyerRoutes from "./routes/lawyers.route.js";
import clientRoutes from "./routes/clients.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/lawyers", lawyerRoutes);
app.use("/api/clients", clientRoutes);

app.listen(port, (err) => {
  if (err) throw err;
  console.log(`server running at port ${port}`);
});
