import { ChangeEvent, useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./PostItem.module.scss";
import { AiOutlineHeart } from "react-icons/ai";
import { BiMessageRounded } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { BsBookmark } from "react-icons/bs";
import { EmojiButton } from "@joeattardi/emoji-button";

const cls = classNames.bind(style);

interface Props {
    avatar: string;
    userName: string;
    images: Array<string>;

    num_like: number;
    description: string;
    num_comment: number;
    create_time: number;
}

function PostItem(props: Props) {
    const [comment, setComment] = useState<string>("");

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

    return (
        <div className={cls("post_item")}>
            {/* title */}
            <div className={cls("title")}>
                <div className={cls("user_info")}>
                    <img src="girl1.jpg" alt="" />
                    <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                        {props.userName}
                    </div>
                </div>
                <div className={cls("more")}>...</div>
            </div>
            {/* content */}
            <div className={cls("post_content")}>
                {props.images.map((value, index) => {
                    return <img src={value} alt="" key={index} />;
                })}
            </div>

            <div className={cls("footer")}>
                {/* action */}
                <div className={cls("action")}>
                    <div className={cls("action_left")}>
                        <AiOutlineHeart />
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
                    {props.create_time} HOURS AGO
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

export default PostItem;
