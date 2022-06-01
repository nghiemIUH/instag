import { memo, useContext, useEffect, useState } from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";
import { Socket } from "socket.io-client";
import SocketContext from "../../context/socket";

import PostItem from "./post/PostItem";
import Story from "./story/Story";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import PostThunk from "./../../redux/post/thunk";
import { ImProfile } from "react-icons/im";
import { RiUserFollowLine } from "react-icons/ri";
import { GrArticle } from "react-icons/gr";
import { MdOutlineAnalytics } from "react-icons/md";
import { CgMenuGridO } from "react-icons/cg";

// =========
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

    const userState = useAppSelector((state) => state.user);
    const postState = useAppSelector((state) => state.post);
    const [selectMenu, setSelectMenu] = useState("post");
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(PostThunk.getAllPost()());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cls("home")}>
            <div className={cls("home_left")}>
                <div className={cls("profile")} id="profile">
                    <div className={cls("menu_profile")}>
                        <div
                            className={cls("close_btn")}
                            onClick={() => {
                                (
                                    document.getElementById(
                                        "profile"
                                    ) as HTMLElement
                                ).style.setProperty("width", "0", "important");
                            }}
                        >
                            &times;
                        </div>
                        <div className={cls("profile_some_info")}>
                            <img
                                src={
                                    process.env.REACT_APP_URL +
                                    "/static/avatars/" +
                                    userState.user.avatar
                                }
                                alt=""
                            />
                            <div>{userState.user.fullName}</div>
                        </div>

                        <div className={cls("menu_button")}>
                            <div
                                className={cls("btn_group")}
                                style={{
                                    backgroundColor:
                                        selectMenu === "post"
                                            ? "#cee5fc"
                                            : "#fff",
                                }}
                                onClick={() => setSelectMenu("post")}
                            >
                                <GrArticle />
                                <div>Post</div>
                            </div>
                            <div
                                className={cls("btn_group")}
                                style={{
                                    backgroundColor:
                                        selectMenu === "profile"
                                            ? "#cee5fc"
                                            : "#fff",
                                }}
                                onClick={() => setSelectMenu("profile")}
                            >
                                <ImProfile />
                                <div>Profile</div>
                            </div>
                            <div
                                className={cls("btn_group")}
                                style={{
                                    backgroundColor:
                                        selectMenu === "followed"
                                            ? "#cee5fc"
                                            : "#fff",
                                }}
                                onClick={() => setSelectMenu("followed")}
                            >
                                <RiUserFollowLine />
                                <div>Followed</div>
                            </div>
                            <div
                                className={cls("btn_group")}
                                style={{
                                    backgroundColor:
                                        selectMenu === "analysis"
                                            ? "#cee5fc"
                                            : "#fff",
                                }}
                                onClick={() => setSelectMenu("analysis")}
                            >
                                <MdOutlineAnalytics />
                                <div>Analysis</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={cls("open_menu")}
                    onClick={() => {
                        (
                            document.getElementById("profile") as HTMLElement
                        ).style.setProperty("width", "20vw", "important");
                    }}
                >
                    <CgMenuGridO />
                </div>
                <Story />
                {postState.post.map((value, index) => {
                    return (
                        <PostItem
                            key={index}
                            userName={value.author.username}
                            avatar={value.author.avatar}
                            images={value.images}
                            likes={value.likes}
                            num_comment={value.comments.length}
                            description={value.content}
                            create_time={new Date(value.date_update)}
                            _id={value._id}
                        />
                    );
                })}
            </div>
            <div className={cls("home_right")}>
                <div className={cls("my_info")}>
                    <img src="avatar.png" alt="" />
                    <div className={cls("info")}>
                        <div style={{ fontSize: "0.8rem", fontWeight: "600" }}>
                            nghiem.van.3133719
                        </div>
                        <div
                            style={{
                                fontSize: "0.9rem",
                                fontWeight: 400,
                                color: "gray",
                            }}
                        >
                            Văn Nghiêm
                        </div>
                    </div>
                    <a href="https://www.instagram.com/">Switch</a>
                </div>

                <div className={cls("suggestion")}>
                    <div
                        style={{
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "gray",
                        }}
                    >
                        Suggestions For You
                    </div>
                    <a href="https://www.instagram.com/">See all</a>
                </div>

                <div className={cls("suggestion_item")}>
                    <div className={cls("suggestion_item_content")}>
                        <img src="girl1.jpg" alt="" />
                        <div className={cls("suggestion_item_name")}>
                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: "600",
                                }}
                            >
                                nghiem.van.3133719
                            </div>
                            <div
                                style={{
                                    fontSize: "0.8rem",
                                    fontWeight: 400,
                                    color: "gray",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "70%",
                                }}
                            >
                                Followed by namnguyenthanh4281
                            </div>
                        </div>
                        <a href="https://www.instagram.com/">Follow</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(Home);
