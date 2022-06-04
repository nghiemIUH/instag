import { PostModel, Post as PostIF } from "../models/post";
import { UserModel, User } from "../models/user";
import { Request, Response } from "express";

class Post {
    async addPost(request: Request, response: Response) {
        const data = request.body as PostIF;
        const user = await UserModel.findOne({ username: data.author });
        const fileName = (request.files as Array<Express.Multer.File>).map(
            (value) => {
                return value.filename;
            }
        );
        const post = new PostModel({
            author: user,
            content: data.content,
            images: fileName,
        });
        await post
            .save()
            .then((_state) => {
                return response.status(200).send({ result: "success" });
            })
            .catch((_error) => {
                console.log(_error);

                return response.status(404).send({ result: "error" });
            });
    }
    async getAll(request: Request, response: Response) {
        const posts = await PostModel.find().populate(
            "author",
            "username avatar"
        );

        return response.status(200).send(posts.reverse());
    }

    async likePost(request: Request, response: Response) {
        const data = request.body;
        const user = await UserModel.findOne({ username: data.username });
        const post = await PostModel.findById(data._id);

        if (post?.likes.includes(user?.id)) {
            await PostModel.updateOne(
                { _id: data._id },
                { $pullAll: { likes: [user?.id] } }
            );
            return response
                .status(200)
                .send({ user_id: user?.id, post_id: data._id, status: "dis" });
        } else {
            await PostModel.updateOne(
                { _id: data._id },
                { $push: { likes: user } }
            );
            return response
                .status(200)
                .send({ user_id: user?.id, post_id: data._id, status: "like" });
        }
    }

    async addComment(request: Request, response: Response) {
        const data = request.body;
        const user = await UserModel.findOne({ username: data.username });
        await PostModel.updateOne(
            { _id: data._id },
            { $push: { comments: [{ author: user, content: data.content }] } }
        );
        return response.status(200).send({ result: "success" });
    }

    async getComment(request: Request, response: Response) {
        const post_id = request.body.post_id;
        const post_comment = await PostModel.findById(post_id)
            .populate({ path: "comments.author", select: "avatar username" })
            .select("comments");
        return response.status(200).send({ comments: post_comment?.comments });
    }

    async getPostUserID(request: Request, response: Response) {
        const { username } = request.body;
        const user = await UserModel.findOne({ username: username });
        console.log(username);

        const posts = await PostModel.find({ author: user }).populate({
            path: "author",
            select: "avatar username",
        });
        return response.status(200).send({ posts });
    }
}

export default new Post();
