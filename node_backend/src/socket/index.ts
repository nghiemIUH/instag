import comment_socket from "./comment";
import { Server } from "socket.io";
import { authen } from "./middleware";

export const onConnect = (io: Server) => {
    io.use(authen).on("connection", (socket) => {
        console.log("num client connected: ", io.of("/").sockets.size);

        comment_socket(io, socket);
        socket.on("disconnect", (reason) => {
            console.log(reason);
        });
    });
};
