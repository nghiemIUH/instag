import comment_socket from "./comment";
import { Server } from "socket.io";
import { authen } from "./middleware";
import chat_socket from "./chat";
import friend_socket from "./friend";

export const onConnect = (io: Server) => {
    io.use((socket, next) => {
        const username = socket.handshake.auth.username;
        (socket as any).username = username;
        next();
    });

    io.use(authen).on("connection", (socket) => {
        console.log("num client connected: ", io.of("/").sockets.size);

        socket.join((socket as any).username);

        comment_socket(io, socket);
        chat_socket(io, socket);
        friend_socket(io, socket);

        socket.on("disconnect", (reason) => {
            console.log(reason);
        });
    });
};
