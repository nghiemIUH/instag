import express from "express";
import post from "../controllers/post";
import authen from "../middlewares/auth";

const postRouter = express.Router();

postRouter.use(authen);
postRouter.post("/add", post.addPost);
postRouter.get("/get-all", post.getAll);
postRouter.post("/like", post.likePost);

export default postRouter;
