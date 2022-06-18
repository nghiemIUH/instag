import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { sign, verify } from "jsonwebtoken";
import {
    User,
    UserModel,
    FriendModel,
    NotifyFriendModel,
    FriendShipModel,
} from "../models/user";
import { GroupModel, ChatModel } from "../models/chat";

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
     * /user/get-notify
     * @param request
     * @param response
     * @returns
     */
    async getNotify(request: Request, response: Response) {
        const { username } = request.body;
        const user = await UserModel.findOne({ username });
        const notify = await NotifyFriendModel.find({ user: user }).populate({
            path: "event",
            populate: { path: "user_1", select: "username avatar" },
        });
        return response.status(200).send({ notify });
    }

    /**
     * /user/get-friend
     * @param request
     * @param response
     * @returns
     */
    async getFriend(request: Request, response: Response) {
        const { username } = request.body;
        const user = await UserModel.findOne({ username: username });
        const friend = await FriendModel.findOne({ user: user }).populate(
            "friend",
            { _id: 1, username: 1, avatar: 1 }
        );
        return response.status(200).send({ friend });
    }

    /**
     * /user/get-friendship
     * @param request
     * @param response
     * @returns
     */
    async getFriendShip(request: Request, response: Response) {
        const { username_1, username_2 } = request.body;
        const user_1 = await UserModel.findOne({ username: username_1 });
        const user_2 = await UserModel.findOne({ username: username_2 });
        const friendShip = await FriendShipModel.findOne({ user_1, user_2 });
        return response.status(200).send({ friendShip });
    }

    /**
     * /user/create-friendship
     * @param request
     * @param response
     * @returns
     */
    async cancelFriendShip(request: Request, response: Response) {
        const { username_1, username_2 } = request.body;
        const user_1 = await UserModel.findOne({ username: username_1 });
        const user_2 = await UserModel.findOne({ username: username_2 });
        const friendShip = await FriendShipModel.findOne({ user_1, user_2 });
        await NotifyFriendModel.deleteOne({ event: friendShip });
        await FriendShipModel.deleteOne({ user_1, user_2 });
        const notify = await NotifyFriendModel.find({ user: user_2 }).populate({
            path: "event",
            populate: { path: "user_1", select: "username avatar" },
        });
        return response.status(200).send({ notify });
    }

    /**
     * /user/add-friend
     * @param request
     * @param response
     * @returns
     */
    async addFriend(request: Request, response: Response) {
        const { username_1, username_2 } = request.body;
        const user_1 = await UserModel.findOne({ username: username_1 });
        const user_2 = await UserModel.findOne({ username: username_2 });

        const friend = await FriendModel.findOne({ user: user_1 });
        if (friend) {
            await FriendModel.updateOne(
                { user: user_1 },
                { $push: { friend: user_2 } }
            );
            await FriendModel.updateOne(
                { user: user_2 },
                { $push: { friend: user_1 } }
            );
        } else {
            await FriendModel.create({ user: user_1, friend: [user_2] });
            await FriendModel.create({ user: user_2, friend: [user_1] });
        }
        const friendShip = await FriendShipModel.findOne({ user_1, user_2 });
        await NotifyFriendModel.deleteOne({ event: friendShip });
        await FriendShipModel.deleteOne({ user_1: user_1, user_2: user_2 });
        const notify = await NotifyFriendModel.find({ user: user_2 }).populate({
            path: "event",
            populate: { path: "user_1", select: "username avatar" },
        });
        return response.status(200).send({ notify });
    }
    /**
     * /user/seen-notify
     * @param request
     * @param response
     * @returns
     */
    async seenNotify(request: Request, response: Response) {
        const { username } = request.body;
        const user = await UserModel.findOne({ username });
        await NotifyFriendModel.updateMany({ user }, { seen: true });
        return response.status(200).send({ result: "succcess" });
    }

    /**
     * /user/unfriend
     * @param request
     * @param response
     * @returns
     */
    async unFriend(request: Request, response: Response) {
        const { username_1, username_2 } = request.body;
        const user_1 = await UserModel.findOne({ username: username_1 });
        const user_2 = await UserModel.findOne({ username: username_2 });
        await FriendModel.updateOne(
            { user: user_1 },
            { $pullAll: { friend: [user_2] } }
        );

        await FriendModel.updateOne(
            { user: user_2 },
            { $pullAll: { friend: [user_1] } }
        );
        const friend = await FriendModel.findOne({ user: user_1 }).populate(
            "friend",
            { _id: 1, username: 1, avatar: 1 }
        );
        return response.status(200).send({ friend });
    }

    /**
     * /user/get-chat
     * @param request
     * @param response
     */
    async getChat(request: Request, response: Response) {
        const { username_1, username_2, num_chat } = request.body;
        const user_1 = await UserModel.findOne({ username: username_1 }).select(
            "_id"
        );
        const user_2 = await UserModel.findOne({ username: username_2 }).select(
            "_id"
        );

        const group = await GroupModel.findOne({
            users: { $all: [user_1, user_2] },
        });
        const chat = await ChatModel.find({ group })
            .populate("sender", {
                _id: 1,
                username: 1,
            })
            .sort({ date: -1 })
            .limit(num_chat);

        return response.status(200).send({ chat: chat.reverse() });
    }
}

export default new UserController();
