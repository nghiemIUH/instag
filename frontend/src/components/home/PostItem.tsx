import { ChangeEvent, useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./PostItem.module.scss";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { EmojiButton } from "@joeattardi/emoji-button";
import Slider from "react-slick";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import PostThunk from "../../redux/post/thunk";

const cls = classNames.bind(style);

interface Props {
    _id?: string;
    avatar: string;
    userName: string;
    images: Array<string>;
    num_like: number;
    description: string;
    num_comment: number;
    create_time: Date;
}

function PostItem(props: Props) {
    const [comment, setComment] = useState<string>("");
    const userState = useAppSelector((state) => state.user);

    const dispatch = useAppDispatch();

    const handleComment = (e: ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    useEffect(() => {
        const picker = new EmojiButton({
            autoHide: false,
            emojiSize: "1.5rem",
            showAnimation: false,
        });
        const trigger = document.querySelector("#icon_picker") as HTMLElement;

        picker.on("emoji", (selection) => {
            const ipt = document.querySelector(
                "#comment_input"
            ) as HTMLInputElement;
            ipt.value += selection.emoji;
        });
        trigger.addEventListener("click", () => picker.togglePicker(trigger));
    }, []);

    const settings = {
        dots: true,
    };

    const handleLike = () => {
        const username = userState.user.username;
        const _id = props._id as string;
        dispatch(PostThunk.like()({ username, _id }));
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
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        {props.userName}
                    </div>
                </div>
                <div className={cls("more")}>...</div>
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
                        <AiOutlineHeart onClick={handleLike} />
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
                    {props.num_like} likes
                </div>

                {/* description */}
                <div>
                    <span>{props.userName}</span> {props.description}
                </div>

                <div className={cls("view_comment")}>
                    View all {props.num_comment} comments
                </div>
                {/* create time */}
                <div className={cls("create_time")}>
                    {formatTime(props.create_time)}
                </div>
            </div>

            <div className={cls("comment")}>
                <img
                    src="1f600.png"
                    alt=""
                    className={cls("select_icon")}
                    id="icon_picker"
                />
                <input
                    type="text"
                    id="comment_input"
                    className={cls("comment_input")}
                    placeholder="Add a comment"
                    onChange={(e) => handleComment(e)}
                />
                <div
                    id="post"
                    className={cls("post")}
                    style={{
                        color:
                            comment.length === 0
                                ? "rgba(0, 0, 255, 0.3)"
                                : "rgba(0, 0, 255, 0.8)",
                    }}
                >
                    Post
                </div>
            </div>
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

export default PostItem;
