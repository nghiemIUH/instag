import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import { User, UserModel, FollowModel } from "../models/user";
import { unlink } from "fs";
class UserController {
    /**
     * POST METHOD
     * /user/register
     * @param request
     * @param response
     */
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

    /**
     * POST METHOD
     * /user/login
     * @param request
     * @param response
     */
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

    /**
     * POST METHOD
     * /user/get-new-token
     * @param request
     * @param response
     */
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

    /**
     * POST METHOD
     * /user/get-user-reload
     * @param request
     * @param response
     */
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

    /**
     * GET METHOD
     * /user/search
     * @param request
     * @param response
     * @returns
     */
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
    /**
     * POST METHOD
     * /user/update
     * @param request
     * @param response
     * @returns
     */
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

    /**
     * POST METHOD
     * /user/find-user-profile
     * @param request
     * @param response
     * @returns
     */
    async findUserProfile(request: Request, response: Response) {
        const username = request.body.username;
        const user = await UserModel.findOne({ username: username });
        if (user) {
            return response.status(200).send({ user });
        } else {
            return response.status(400).send({ result: "error" });
        }
    }

    /**
     * POST
     * /user/get-follow
     * @param request
     * @param response
     * @returns
     */
    async getFollow(request: Request, response: Response) {
        const username = request.body.username;
        const user = await UserModel.findOne({ username: username });
        const follow = await FollowModel.findOne({ user: user }).populate(
            "followers",
            { _id: 1, username: 1 }
        );

        return response.status(200).send({ follow });
    }

    /**
     * POST METHOD
     * /user/follow
     * @param request
     * @param response
     * @returns
     */
    async follow(request: Request, response: Response) {
        const { current_username, other_username } = request.body;

        const curren_user = await UserModel.findOne({
            username: current_username,
        });
        const other_user = await UserModel.findOne({
            username: other_username,
        });

        const curren_follow = await FollowModel.findOne({ user: curren_user });
        const other_follow = await FollowModel.findOne({ user: other_user });

        if (curren_follow === null) {
            await FollowModel.create({ user: curren_user });
            await FollowModel.create({ user: other_user });
        }

        if (curren_follow?.followers.includes(other_follow?.user)) {
            // unfollow
            await FollowModel.updateOne(
                { user: curren_user },
                { $pull: { followers: other_user?.id } }
            );
            await FollowModel.updateOne(
                { user: other_user },
                { $pull: { followings: curren_user?.id } }
            );
        } else {
            // follow
            await FollowModel.updateOne(
                { user: curren_user },
                { $push: { followers: other_user?.id } }
            );
            await FollowModel.updateOne(
                { user: other_user },
                { $push: { followings: curren_user?.id } }
            );
        }
        const new_follow = await FollowModel.findOne({
            user: curren_user,
        }).populate("followers", { _id: 1, username: 1 });
        return response.status(200).send({ new_follow: new_follow });
    }
}

export default new UserController();
