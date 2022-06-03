import express from "express";
import post from "../controllers/post";
import authen from "../middlewares/auth";

const postRouter = express.Router();

postRouter.use(authen);
postRouter.post("/add", post.addPost);
postRouter.get("/get-all", post.getAll);
postRouter.post("/like", post.likePost);
postRouter.post("/comment", post.addComment);
postRouter.post("/get-comment", post.getComment);
postRouter.post("/get-post-by-userid", post.getPostUserID);

export default postRouter;
