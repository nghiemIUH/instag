import { Express } from "express";
import userRouter from "./user";
import postRouter from "./post";
import { avatarUpload, postUpload } from "../config/fileUpload";

const routers = (app: Express) => {
    app.use("/user", avatarUpload.single("avatar"), userRouter);
    app.use("/post", postUpload.array("images", 20), postRouter);
};

export default routers;
