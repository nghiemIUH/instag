import { memo, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";

import PostItem from "./post/PostItem";
import Story from "./story/Story";
import { useAppDispatch, useAppSelector } from "./../../redux/hooks";
import PostThunk from "./../../redux/post/thunk";

// =========
const cls = classNames.bind(style);

function Home() {
    const postState = useAppSelector((state) => state.post);
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(
            PostThunk.getAllPost()({ access_token: userState.access_token })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={cls("home")}>
            <div className={cls("home_left")}>
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
