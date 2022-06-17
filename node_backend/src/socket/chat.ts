import { Server, Socket } from "socket.io";

const chat_socket = (io: Server, socket: Socket) => {
    const username = (socket as any).username;
    socket.on("message", ({ content, to }) => {
        console.log(to);

        io.sockets.to(to).emit("re-message", {
            content,
            from: username,
        });
    });
};

export default chat_socket;
