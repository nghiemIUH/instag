import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { User, UserModel } from "../models/user";
import { unlink } from "fs";
import path from "path";
class UserController {
    async register(request: Request, response: Response) {
        const data = request.body as User;

        data.password = bcrypt.hashSync(data.password, 10);
        const oldUser = await UserModel.findOne({ username: data.username });
        if (oldUser) {
            response.status(404).send({ result: "user is existed" });
        } else {
            data.avatar = request.file?.filename as string;
            const user = new UserModel(data);
            await user
                .save()
                .then((_success) => {
                    response.status(200).send({ result: "success" });
                })
                .catch((_error) => {
                    response.status(404).send({ result: "error" });
                });
        }
    }

    async login(request: Request, response: Response) {
        const data = request.body;
        const user = (await UserModel.findOne({
            username: data.username,
        })) as User;
        if (user && (await bcrypt.compare(data.password, user.password))) {
            const access_token = sign(
                { username: user.username },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: process.env.ACCESS_TOKEN_LIFE }
            );

            const refresh_token = sign(
                { username: user.username },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn: process.env.REFRESH_TOKEN_LIFE }
            );
            response.status(200).send({ user, access_token, refresh_token });
        } else {
            response.status(404).send({ result: "error" });
        }
    }

    getNewAccessToken(request: Request, response: Response) {
        const token = request.body.refresh_token as string;

        if (token) {
            try {
                const user = verify(
                    token,
                    process.env.REFRESH_TOKEN_SECRET as string
                ) as any;

                const access_token = sign(
                    { username: user.username },
                    process.env.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: process.env.ACCESS_TOKEN_LIFE }
                );
                response.status(200).send({ access_token });
            } catch (error) {
                response.status(404).send({ result: "not auth" });
            }
        } else {
            response.status(404).send({ result: "token not provided" });
        }
    }

    async getUserInfo(request: Request, response: Response) {
        const token = request.body.refresh_token as string;

        if (token) {
            try {
                const username = (
                    verify(
                        token,
                        process.env.REFRESH_TOKEN_SECRET as string
                    ) as any
                ).username;

                const access_token = sign(
                    { username: username },
                    process.env.ACCESS_TOKEN_SECRET as string,
                    { expiresIn: process.env.ACCESS_TOKEN_LIFE }
                );
                const user = await UserModel.findOne({
                    username: username,
                });
                response.status(200).send({ user, access_token });
            } catch (error) {
                response.status(404).send({ result: "token error" });
            }
        } else {
            response.status(404).send({ result: "token error" });
        }
    }

    async search(request: Request, response: Response) {
        const search = request.query.search as string;

        const user = await UserModel.find({
            $or: [
                {
                    username: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    fullName: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ],
        }).select("username avatar fullName");
        return response.status(200).send(user);
    }
    async update(request: Request, response: Response) {
        const data = request.body;
        const old_user = await UserModel.findOne({ username: data.username });
        if (data.password) {
            data.password = bcrypt.hashSync(data.password, 10);
        }

        if (request.file) {
            data.avatar = request.file?.filename as string;
            unlink(
                ("static/avatars/" + old_user?.avatar) as string,
                (error) => {
                    console.log(error);
                }
            );
        }
        await UserModel.updateOne({ username: data.username }, data);
        const user = await UserModel.findOne({ username: data.username });
        if (user) {
            return response.status(200).send({ user });
        }
        return response.status(400).send({ user });
    }
}

export default new UserController();
