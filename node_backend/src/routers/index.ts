import { Express } from "express";
import userRouter from "./user";
import { avatarUpload } from "../config/fileUpload";

const routers = (app: Express) => {
    app.use("/user", avatarUpload.single("avatar"), userRouter);
};

export default routers;
