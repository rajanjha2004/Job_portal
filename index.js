import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectdb from "./confugure/db.js";
import test from "./routes/test.js";
import authorizingRoutes from "./routes/authorizingRoutes.js"
import morgan from "morgan";
import cors from "cors";
import errormiddleware from './middleware/middleware.js';
import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"
import "express-async-errors";
const app = express();
const PORT = process.env.PORT || 8000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
dotenv.config();
connectdb();

app.use("/", test);
app.use("/", authorizingRoutes);
app.use("/", userRoutes);
app.use("/", jobRoutes);


app.use(errormiddleware)

app.listen(PORT, () => {
    console.log(`Server is running in ${process.env.DEV_MODE} on port ${PORT}`.bgCyan.white);
});
