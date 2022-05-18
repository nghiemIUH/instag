import React from "react";
import classNames from "classnames/bind";
import style from "./HomeLeft.module.scss";
import PostItem from "./PostItem";
import Story from "./Story";

const cls = classNames.bind(style);

function HomeLeft() {
    return (
        <div className={cls("home_left")}>
            <Story />
            <PostItem
                userName="Cute girl"
                avatar="girl1.jpg"
                images={["girl1.jpg"]}
                num_like={10}
                num_comment={20}
                description="Kết quả test pin Xiaomi 12 Pro: Thời gian Onscreen 4 tiếng 20 phút, sạc nhanh 35 phút đầy pin"
                create_time={10}
            />

            <PostItem
                userName="Cute girl"
                avatar="girl1.jpg"
                images={["girl1.jpg"]}
                num_like={10}
                num_comment={20}
                description="Kết quả test pin Xiaomi 12 Pro: Thời gian Onscreen 4 tiếng 20 phút, sạc nhanh 35 phút đầy pin"
                create_time={10}
            />
        </div>
    );
}

export default HomeLeft;
