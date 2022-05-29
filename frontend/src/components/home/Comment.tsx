import { memo } from "react";
import Modal from "react-modal";
import classNames from "classnames/bind";
import style from "./Comment.module.scss";
import Slider from "react-slick";
import "./Comment.css";

const cls = classNames.bind(style);

Modal.setAppElement("#root");
function Comment({ images, comments, isOpen, setIsOpen }: Props) {
    console.log("render");

    return (
        <div style={{}}>
            <div className={cls("wrapper")}></div>

            <div
                id="demo-modal"
                className={cls("modal")}
                style={isOpen ? { visibility: "visible", opacity: 1 } : {}}
            >
                <div className={cls("modal__content")}>
                    <div className={cls("modal_header")}>
                        <div
                            className={cls("modal__close")}
                            onClick={() => setIsOpen(false)}
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
                            <div className={cls("cmt_top")}>
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

                            <div className={cls("cmt_bottom")}>
                                <input
                                    type="text"
                                    placeholder="Input comment..."
                                />
                                <button>Post</button>
                            </div>
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
    comments: Array<any> | undefined;
}

export default memo(Comment);
