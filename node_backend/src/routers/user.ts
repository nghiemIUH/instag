import express from "express";
import UserController from "../controllers/user";

const userRouter = express.Router();
userRouter.post("/login", UserController.login);
userRouter.post("/register", UserController.register);
userRouter.post("/get-new-token", UserController.getNewAccessToken);
userRouter.post("/get-user-reload", UserController.getUserInfo);

export default userRouter;
