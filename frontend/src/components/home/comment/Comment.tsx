import {
    FormEvent,
    memo,
    useEffect,
    useState,
    useContext,
    useRef,
} from "react";
import classNames from "classnames/bind";
import style from "./Comment.module.scss";
import Slider from "react-slick";
import "./Comment.css";
import { Socket } from "socket.io-client";
import { useAppSelector } from "../../../redux/hooks";
import SocketContext from "../../../context/socket";

const cls = classNames.bind(style);

function Comment({ images, isOpen, setIsOpen, post_id }: Props) {
    const { socket } = useContext(SocketContext) as SocketContextType;

    const [comments, setComments] = useState<Array<CommentType>>([]);
    const userState = useAppSelector((state) => state.user);
    const comment_ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        comment_ref.current?.scrollTo(0, comment_ref.current.scrollHeight);
    }, [comments]);

    useEffect(() => {
        const result = fetch(process.env.REACT_APP_URL + "/post/get-comment", {
            method: "post",
            headers: {
                Authorization: "Bearer " + userState.access_token,
                "content-type": "application/json",
            },
            body: JSON.stringify({ post_id }),
        });
        result
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setComments(data.comments);
            })
            .catch((e) => {});
    }, [post_id, userState.access_token]);

    useEffect(() => {
        socket?.on(post_id as string, (data) => {
            setComments((prev) => {
                return [...prev, data];
            });
        });
    }, [post_id, socket]);

    const handleSubmitComment = (e: FormEvent) => {
        e.preventDefault();
        const comment_input = document.getElementById(
            "cmt_input"
        ) as HTMLInputElement;

        socket?.emit("add-comment", {
            content: comment_input.value,
            post_id: post_id,
            author: {
                avatar: userState.user.avatar,
                username: userState.user.username,
            },
            date: new Date(),
        });
        comment_input.value = "";
    };

    return (
        <div>
            <div
                id="modal"
                className={cls("modal")}
                style={isOpen ? { visibility: "visible", opacity: 1 } : {}}
            >
                <div className={cls("modal__content")}>
                    <div className={cls("modal_header")}>
                        <div
                            className={cls("modal__close")}
                            onClick={() => {
                                setIsOpen((prev: boolean) => false);
                            }}
                        >
                            &times;
                        </div>
                    </div>
                    <div className={cls("modal_body")}>
                        <div className={cls("slider_img")}>
                            <Slider {...settings}>
                                {images.map((value, index) => {
                                    return (
                                        <img
                                            key={index}
                                            src={
                                                process.env.REACT_APP_URL +
                                                "/static/post/" +
                                                value
                                            }
                                            alt=""
                                        />
                                    );
                                })}
                            </Slider>
                        </div>
                        <div className={cls("list_cmt")}>
                            <div className={cls("cmt_top")} ref={comment_ref}>
                                {comments?.map((value, index) => {
                                    return (
                                        <div
                                            className={cls("cmt_item")}
                                            key={index}
                                        >
                                            <img
                                                src={
                                                    process.env.REACT_APP_URL +
                                                    "/static/avatars/" +
                                                    value.author.avatar
                                                }
                                                alt=""
                                            />
                                            <div className={cls("cmt_content")}>
                                                <div
                                                    className={cls(
                                                        "cmt_content_info"
                                                    )}
                                                >
                                                    <div
                                                        className={cls(
                                                            "cmt_content_user"
                                                        )}
                                                    >
                                                        {value.author.username}
                                                    </div>
                                                    <div
                                                        className={cls(
                                                            "cmt_content_text"
                                                        )}
                                                    >
                                                        {value.content}
                                                    </div>
                                                </div>
                                                <div
                                                    className={cls(
                                                        "cmt_content_time"
                                                    )}
                                                >
                                                    {formatTime(
                                                        new Date(value.date)
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <form
                                className={cls("cmt_bottom")}
                                onSubmit={(e) => handleSubmitComment(e)}
                            >
                                <input
                                    type="text"
                                    placeholder="Input comment..."
                                    id="cmt_input"
                                    autoComplete="off"
                                />
                                <button>Post</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const formatTime = (dateTime: Date) => {
    const minute = Math.abs(new Date().getTime() - dateTime.getTime()) / 6e4;
    if (minute < 60) {
        return `${parseInt(minute + "")} minutes`;
    }

    const hour = minute / 60;

    if (hour < 24) {
        return `${parseInt(hour + "")} hours`;
    }
    const day = hour / 24;
    if (day < 4) {
        return `${parseInt(day + "")} days`;
    }

    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const date = dateTime.getDate();

    return `${date}/${month}/${year}`;
};

const settings = {
    dots: true,
};

interface Props {
    setIsOpen?: any;
    isOpen?: boolean;
    images: Array<string>;
    post_id: string | undefined;
}

interface SocketContextType {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}
interface CommentType {
    content: string;
    author: {
        username: string;
        avatar: string;
    };
    date: string;
}

export default memo(Comment);
