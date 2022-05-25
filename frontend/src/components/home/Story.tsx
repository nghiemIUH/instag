import React from "react";
import classNames from "classnames/bind";
import style from "./Story.module.scss";

const cls = classNames.bind(style);
function Story() {
    return (
        <div className={cls("story")}>
            <div className={cls("story_item")}>
                <img src="girl1.jpg" alt="" />
                <div className={cls("user_id")}>girl.music.19</div>
            </div>
            <div className={cls("story_item")}>
                <img src="girl1.jpg" alt="" />
                <div className={cls("user_id")}>girl.music.19</div>
            </div>
        </div>
    );
}

export default Story;
