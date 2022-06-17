import { FormEvent, useContext, useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Chat.module.scss";
import { BiSearchAlt2 } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import SocketContext from "../../context/socket";
import { Socket } from "socket.io-client";
import { UserInfo } from "../../entities/user";

const cls = classNames.bind(style);
interface SocketContextType {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

interface FriendType {
    user: UserInfo;
    friends: Array<UserInfo>;
}

function Chat() {
    const { socket } = useContext(SocketContext) as SocketContextType;
    const [friends, setFriends] = useState<FriendType | null>(null);
    const [selectUser, setSelectUser] = useState<{
        username: string;
        avatar: string;
    } | null>(null);

    const send = (e: FormEvent) => {
        e.preventDefault();
        const content = (
            document.getElementById("input_mess") as HTMLInputElement
        ).value;
        socket?.emit("message", { content, to: selectUser?.username });
    };
    useEffect(() => {
        socket?.on("re-message", (data) => {
            console.log(data);
        });
    }, [socket]);

    return (
        <div className={cls("chat")}>
            <div className={cls("old_chat")}>
                <div className={cls("search_friend")}>
                    <div className={cls("search_block")}>
                        <input type="text" placeholder="Search friends..." />
                        <BiSearchAlt2 />
                    </div>
                </div>
                <div className={cls("list_friend")}>
                    {friends?.friends?.map((value, index) => {
                        return (
                            <div
                                className={cls("friend")}
                                key={index}
                                onClick={() =>
                                    setSelectUser({
                                        username: value.username,
                                        avatar: value.avatar as string,
                                    })
                                }
                            >
                                <img
                                    src={
                                        process.env.REACT_APP_URL +
                                        "/static/avatars/" +
                                        value.avatar
                                    }
                                    alt=""
                                />
                                <div>{value.username}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className={cls("chat_box")}>
                <div className={cls("chat_header")}>
                    {selectUser && (
                        <>
                            <img
                                src={
                                    process.env.REACT_APP_URL +
                                    "/static/avatars/" +
                                    selectUser.avatar
                                }
                                alt=""
                            />
                            <div>{selectUser.username}</div>
                        </>
                    )}
                </div>
                <div className={cls("chat_body")}>
                    {selectUser && (
                        <>
                            <div className={cls("chat_friend")}>
                                <img src="avatar.png" alt="" />
                                <p>
                                    Lorem, ipsum dolor sit amet consectetur
                                    adipisicing elit. Adipisci quae sapiente
                                    eaque laborum perferendis fugiat illum sunt,
                                    animi eum nostrum quibusdam est natus
                                    blanditiis dolorum unde consequatur
                                    doloribus soluta consequuntur.
                                </p>
                            </div>
                            <div className={cls("chat_friend")}>
                                <img src="avatar.png" alt="" />
                                <p>
                                    Lorem, ipsum dolor sit amet consectetur
                                    adipisicing elit. Adipisci quae sapiente
                                    eaque laborum perferendis fugiat illum sunt,
                                    animi eum nostrum quibusdam est natus
                                    blanditiis dolorum unde consequatur
                                    doloribus soluta consequuntur.
                                </p>
                            </div>
                            <div className={cls("chat_friend")}>
                                <img src="avatar.png" alt="" />
                                <p>
                                    Lorem, ipsum dolor sit amet consectetur
                                    adipisicing elit. Adipisci quae sapiente
                                    eaque laborum perferendis fugiat illum sunt,
                                    animi eum nostrum quibusdam est natus
                                    blanditiis dolorum unde consequatur
                                    doloribus soluta consequuntur.
                                </p>
                            </div>

                            <div className={cls("chat_own")}>
                                <img src="avatar.png" alt="" />
                                <p>
                                    Lorem, ipsum dolor sit amet consectetur
                                    adipisicing elit. Adipisci quae sapiente
                                    eaque laborum perferendis fugiat illum sunt,
                                    animi eum nostrum quibusdam est natus
                                    blanditiis dolorum unde consequatur
                                    doloribus soluta consequuntur.
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {selectUser && (
                    <div className={cls("chat_footer")}>
                        <form action="" onSubmit={(e) => send(e)}>
                            <input
                                type="text"
                                placeholder="Message..."
                                id="input_mess"
                                autoComplete="off"
                            />
                            <button>
                                <FiSend />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;
