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
        const post = (await PostModel.findById(data._id)) as PostIF;

        console.log(data);

        return response.status(200).send({ result: "test" });
    }
}

export default new Post();
