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
        if (!socket?.connected) {
            connect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connect = () => {
        const s = io(process.env.REACT_APP_URL as string, {
            query: { access_token: userState.access_token },
        });
        s.on("connect", () => {});
        setSocket(s);
    };

    const disconnect = () => {
        socket?.disconnect();
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
