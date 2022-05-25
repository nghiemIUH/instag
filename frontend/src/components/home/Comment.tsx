import { useEffect, useState } from "react";
import Modal from "react-modal";
import classNames from "classnames/bind";
import style from "./comment.module.scss";
import "./comment.css";
import Slider from "react-slick";
import { EmojiButton } from "@joeattardi/emoji-button";

const cls = classNames.bind(style);

const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "75%",
    },
};

const settings = {
    dots: true,
};

interface Props {
    modalIsOpen: boolean;
    closeModal: any;
    images: Array<string>;
    comments: Array<any> | undefined;
}

Modal.setAppElement("#root");
function Comment({ modalIsOpen, closeModal, images, comments }: Props) {
    const [isAddIcon, setIsAddIcon] = useState<boolean>(false);
    useEffect(() => {
        if (isAddIcon) {
            const picker = new EmojiButton({
                autoHide: false,
                emojiSize: "1.5rem",
                showAnimation: false,
            });
            const trigger = document.querySelector(
                "#icon_picker_modal_cmt"
            ) as HTMLElement;

            // icon_picker_modal_cmt
            picker.on("emoji", (selection) => {
                const ipt = document.querySelector(
                    "#cmt_input"
                ) as HTMLInputElement;
                ipt.value += selection.emoji;
            });
            trigger.addEventListener("click", () =>
                picker.togglePicker(trigger)
            );
        }
    }, [isAddIcon]);

    return (
        <div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <div
                    className={cls("comment_content")}
                    onLoad={() => setIsAddIcon(true)}
                >
                    <div className={cls("comment_img")}>
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
                    <div className={cls("comment")}>
                        <div className={cls("cmt_items")}>
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
                                            className={cls("cmt_user_avatar")}
                                        />
                                        <div className={cls("cmt_content")}>
                                            <div>{value.content}</div>
                                            <div>
                                                {formatTime(
                                                    new Date(value.date)
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className={cls("cmt_input_block")}>
                            <img
                                src="1f600.png"
                                alt=""
                                className={cls("select_icon")}
                                id="icon_picker_modal_cmt"
                            />
                            <input
                                type="text"
                                className={cls("cmt_input")}
                                placeholder="Input your comment"
                                id="cmt_input"
                            />
                            <button>Post</button>
                        </div>
                    </div>
                </div>
            </Modal>
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

export default Comment;
