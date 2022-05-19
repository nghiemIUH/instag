import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routers from "./routers/index";
import connectDB from "./config/connect";

dotenv.config();
const PORT: number = parseInt(process.env.PORT as string);
const app = express();
app.use("/static", express.static("static"));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
routers(app);
connectDB();

app.listen(PORT);
