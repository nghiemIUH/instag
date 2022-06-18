import { FormEvent, useContext, useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Chat.module.scss";
import { BiSearchAlt2 } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import SocketContext from "../../context/socket";
import { Socket } from "socket.io-client";
import { UserInfo } from "../../entities/user";
import axiosConfig from "../../configs/axiosConfig";
import { useAppSelector } from "../../redux/hooks";

const cls = classNames.bind(style);
interface SocketContextType {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

interface FriendType {
    user: UserInfo;
    friend: Array<UserInfo>;
}

interface ChatType {
    _id: string;
    group: String;
    sender: UserInfo;
    content: string;
    date: Date;
}

function Chat() {
    const { socket } = useContext(SocketContext) as SocketContextType;
    const [friends, setFriends] = useState<FriendType | null>(null);
    const userState = useAppSelector((state) => state.user);
    const [selectUser, setSelectUser] = useState<{
        username: string;
        avatar: string;
    } | null>(null);
    const [chat, setChat] = useState<Array<ChatType>>([]);

    useEffect(() => {
        const getFriend = async () => {
            return await axiosConfig({
                isFormData: false,
                access_token: userState.access_token,
            })({
                url: "/user/get-friend",
                method: "post",
                data: JSON.stringify({ username: userState.user.username }),
            });
        };
        getFriend().then((response) => setFriends(response.data.friend));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        const getChat = async () => {
            return await axiosConfig({
                isFormData: false,
                access_token: userState.access_token,
            })({
                url: "/user/get-chat",
                method: "post",
                data: JSON.stringify({
                    username_1: userState.user.username,
                    username_2: selectUser?.username,
                }),
            });
        };
        getChat().then((response) => {
            setChat(response.data.chat);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectUser]);

    useEffect(() => {
        socket?.on("re-message", (data) => {
            setChat((prev) => {
                return [...prev, data.chat];
            });
        });
    }, [socket]);
    useEffect(() => {
        const chat_body = document.getElementById(
            "chat_body"
        ) as HTMLDivElement;
        chat_body.scrollTop = chat_body.scrollHeight;
    }, [chat]);

    const send = (e: FormEvent) => {
        e.preventDefault();
        const content = document.getElementById(
            "input_mess"
        ) as HTMLInputElement;
        socket?.emit("message", {
            content: content.value,
            from: userState.user.username,
            to: selectUser?.username,
        });
        content.value = "";
    };
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
                    {friends?.friend?.map((value, index) => {
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
                <div className={cls("chat_body")} id="chat_body">
                    {selectUser && (
                        <>
                            {chat.map((value, index) => {
                                return value.sender._id ===
                                    userState.user._id ? (
                                    <div
                                        className={cls("chat_own")}
                                        key={index}
                                    >
                                        <img
                                            src={
                                                process.env.REACT_APP_URL +
                                                "/static/avatars/" +
                                                userState.user.avatar
                                            }
                                            alt=""
                                        />
                                        <p>{value.content}</p>
                                    </div>
                                ) : (
                                    <div
                                        className={cls("chat_friend")}
                                        key={index}
                                    >
                                        <img
                                            src={
                                                process.env.REACT_APP_URL +
                                                "/static/avatars/" +
                                                selectUser.avatar
                                            }
                                            alt=""
                                        />
                                        <p>{value.content}</p>
                                    </div>
                                );
                            })}
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
