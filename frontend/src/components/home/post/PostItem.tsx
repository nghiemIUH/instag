import { useEffect, useState, memo, FormEvent, useRef } from "react";
import classNames from "classnames/bind";
import style from "./PostItem.module.scss";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { EmojiButton } from "@joeattardi/emoji-button";
import Slider from "react-slick";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import PostThunk from "../../../redux/post/thunk";
import Comment from "../comment/Comment";

import { toast, ToastContainer, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cls = classNames.bind(style);

interface Props {
    _id?: string;
    avatar: string;
    userName: string;
    images: Array<string>;
    likes: Array<string>;
    description: string;
    num_comment: number;
    create_time: Date;
}

function PostItem(props: Props) {
    const userState = useAppSelector((state) => state.user);
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const picker = new EmojiButton({
            autoHide: false,
            emojiSize: "1.5rem",
            showAnimation: false,
        });
        const trigger = document.querySelector("#icon_picker") as HTMLElement;

        picker.on("emoji", (selection) => {
            const ipt = document.querySelector(
                "#comment_input" + userState.user._id
            ) as HTMLInputElement;
            ipt.value += selection.emoji;
        });
        trigger.addEventListener("click", () => picker.togglePicker(trigger));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const settings = {
        dots: true,
    };

    const handleLike = () => {
        const username = userState.user.username;
        const _id = props._id as string;
        dispatch(
            PostThunk.like()({
                _data: { username, _id },
                access_token: userState.access_token,
            })
        );
    };

    const toastId = useRef<Id | null>(null);
    const notify = () => {
        if (!toast.isActive(toastId.current as Id)) {
            toastId.current = toast.success("Success", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                containerId: props._id,
            }) as Id;
        }
    };
    const handleComment = (e: FormEvent) => {
        e.preventDefault();
        const comment_input = document.getElementById(
            "comment_input" + userState.user._id
        ) as HTMLInputElement;
        const content = comment_input.value;
        const username = userState.user.username;
        const _id = props._id as string;

        dispatch(
            PostThunk.comment()({
                _data: { username, _id, content },
                access_token: userState.access_token,
            })
        );
        comment_input.value = "";
    };
    return (
        <div className={cls("post_item")}>
            {/* title */}
            <div className={cls("title")}>
                <div className={cls("user_info")}>
                    <img
                        src={
                            process.env.REACT_APP_URL +
                            "/static/avatars/" +
                            props.avatar
                        }
                        alt=""
                    />
                    <div style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                        {props.userName}
                    </div>
                </div>
            </div>
            {/* content */}
            <div className={cls("post_content")}>
                <Slider {...settings}>
                    {props.images.map((value, index) => {
                        return (
                            <img
                                src={
                                    process.env.REACT_APP_URL +
                                    "/static/post/" +
                                    value
                                }
                                alt=""
                                key={index}
                            />
                        );
                    })}
                </Slider>
            </div>

            <div className={cls("footer")}>
                {/* action */}
                <div className={cls("action")}>
                    <div className={cls("action_left")}>
                        {props.likes.includes(userState.user._id as string) ? (
                            <AiFillHeart
                                onClick={handleLike}
                                style={{ color: "red" }}
                            />
                        ) : (
                            <AiOutlineHeart onClick={handleLike} />
                        )}

                        <BiMessageRounded />
                        <FiSend />
                    </div>
                    <div className={cls("action_right")}>
                        <BsBookmark />
                    </div>
                </div>
                {/* liked */}
                <div
                    style={{
                        fontSize: "0.9rem",
                        fontWeight: 600,
                    }}
                >
                    {props.likes.length} likes
                </div>

                {/* description */}
                <div>
                    <span>{props.userName}</span> {props.description}
                </div>

                <div
                    onClick={() => {
                        setIsOpen((prev) => true);
                    }}
                    className={cls("view_comment")}
                >
                    View all comment
                </div>

                {isOpen && (
                    <Comment
                        images={props.images}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        post_id={props._id}
                    />
                )}

                {/* create time */}
                <div className={cls("create_time")}>
                    {formatTime(props.create_time)}
                </div>
            </div>

            <form className={cls("comment")} onSubmit={(e) => handleComment(e)}>
                <img
                    src="/1f600.png"
                    alt=""
                    className={cls("select_icon")}
                    id="icon_picker"
                />
                <input
                    type="text"
                    id={"comment_input" + userState.user._id}
                    className={cls("comment_input")}
                    placeholder="Add a comment"
                    autoComplete="off"
                />
                <button
                    id={"post" + props._id}
                    className={cls("post")}
                    style={{
                        color: "rgba(0, 0, 255, 0.8)",
                    }}
                    onClick={notify}
                >
                    Post
                </button>
                <ToastContainer containerId={props._id} enableMultiContainer />
            </form>
        </div>
    );
}

const formatTime = (dateTime: Date) => {
    const minute = Math.abs(new Date().getTime() - dateTime.getTime()) / 6e4;
    if (minute < 60) {
        return `${parseInt(minute + "")} minutes ago`;
    }

    const hour = minute / 60;

    if (hour < 24) {
        return `${parseInt(hour + "")} hours ago`;
    }
    const day = hour / 24;
    if (day < 4) {
        return `${parseInt(day + "")} days ago`;
    }

    const year = dateTime.getFullYear();
    const month = dateTime.getMonth() + 1;
    const date = dateTime.getDate();

    return `${date}/${month}/${year}`;
};

export default memo(PostItem);
