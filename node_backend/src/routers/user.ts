import express from "express";
import UserController from "../controllers/user";
import authen from "../middlewares/auth";
const userRouter = express.Router();
userRouter.post("/login", UserController.login);
userRouter.post("/register", UserController.register);
userRouter.post("/get-new-token", UserController.getNewAccessToken);
userRouter.post("/get-user-reload", UserController.getUserInfo);
userRouter.get("/search", UserController.search);
userRouter.use(authen);
userRouter.post("/update", UserController.update);
userRouter.post("/find-user-profile", UserController.findUserProfile);
userRouter.post("/get-follow", UserController.getFollow);
userRouter.post("/follow", UserController.follow);

export default userRouter;
