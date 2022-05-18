import React from "react";
import classNames from "classnames/bind";
import style from "./HomeRight.module.scss";

const cls = classNames.bind(style);

function HomeRight() {
    return (
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
                        <div style={{ fontSize: "0.8rem", fontWeight: "600" }}>
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
    );
}

export default HomeRight;
