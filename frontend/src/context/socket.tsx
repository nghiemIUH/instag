import React, { createContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../redux/hooks";

interface SocketContextType {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

interface Props {
    children: React.ReactNode;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: Props) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const userState = useAppSelector((state) => state.user);

    useEffect(() => {
        if (userState.access_token.length > 0) {
            if (socket) {
                disconnect();
            }
            connect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userState]);

    const connect = () => {
        const s = io(process.env.REACT_APP_URL as string, {
            query: { access_token: userState.access_token },
        });
        s.auth = { username: userState.user.username };
        s.on("connect", () => {
            console.log("connected");
        });
        setSocket(s);
    };

    const disconnect = () => {
        setSocket((prev) => {
            prev?.disconnect();
            return prev;
        });
    };

    const contextData = {
        socket: socket,
        connect: connect,
        disconnect: disconnect,
    };

    return (
        <SocketContext.Provider value={contextData}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
