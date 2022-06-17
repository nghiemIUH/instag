import { Server, Socket } from "socket.io";
import { UserModel, FriendShipModel, NotifyFriendModel } from "../models/user";

const friend_socket = (io: Server, socket: Socket) => {
    socket.on("create-friendship", async (data) => {
        const { username_1, username_2 } = data;
        const user_1 = await UserModel.findOne({ username: username_1 });
        const user_2 = await UserModel.findOne({ username: username_2 });
        const friendShip = await FriendShipModel.create({ user_1, user_2 });
        await NotifyFriendModel.create({
            user: user_2,
            event: friendShip,
        });
        const notify = await NotifyFriendModel.findOne({
            user: user_2,
            event: friendShip,
        }).populate({
            path: "event",
            populate: { path: "user_1 user_2", select: "username avatar" },
        });
        io.sockets.to(username_2).emit("notify", notify);
        socket.emit("get-friendship", friendShip);
    });

    socket.on("accept-friend", (data) => {
        io.sockets
            .to(data.username_1)
            .to(data.username_2)
            .emit("ac_friend_notify", {
                ...data,
            });
    });
};

export default friend_socket;
