import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routers from "./routers/index";
import connectDB from "./config/connect";
import { Server } from "socket.io";
import { onConnect } from "./socket/index";

dotenv.config();
const PORT: number = parseInt(process.env.PORT as string);
const app = express();
app.use("/static", express.static("static"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(helmet());
connectDB();
routers(app);

const server = app.listen(PORT);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});
onConnect(io);
