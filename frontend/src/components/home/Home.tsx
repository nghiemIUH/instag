import { memo, useContext, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import { Socket } from "socket.io-client";
import SocketContext from "../context/socket";

// =========
import HomeLeft from "./HomeLeft";
import HomeRight from "./HomeRight";
const cls = classNames.bind(style);

interface SocketContextType {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

function Home() {
    const { socket, connect, disconnect } = useContext(
        SocketContext
    ) as SocketContextType;
    useEffect(() => {
        if (!socket) {
            connect();
        }
        if (!socket?.connected) {
            disconnect();
            connect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cls("home")}>
            <HomeLeft />
            <HomeRight />
        </div>
    );
}

export default memo(Home);
