import { Socket } from "socket.io";
import { verify } from "jsonwebtoken";

export const authen = (socket: Socket, next: any) => {
    const access_token = socket.handshake.query.access_token;
    try {
        verify(
            access_token as string,
            process.env.ACCESS_TOKEN_SECRET as string
        );
        next();
    } catch (error) {
        next(new Error("Not authenticate"));
    }
};
