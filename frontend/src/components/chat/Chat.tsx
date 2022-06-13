import React from "react";
import classNames from "classnames/bind";
import style from "./Chat.module.scss";
import { BiSearchAlt2 } from "react-icons/bi";

const cls = classNames.bind(style);

function Chat() {
    return (
        <div className={cls("chat")}>
            <div className={cls("old_chat")}>
                <div className={cls("search_friend")}>
                    <div className={cls("search_block")}>
                        <input type="text" placeholder="Search friends..." />
                        <BiSearchAlt2 />
                    </div>
                </div>
                <div className={cls("list_friend")}>
                    <div className={cls("friend")}>
                        <img src="avatar.png" alt="" />
                        <div>Admin</div>
                    </div>
                </div>
            </div>
            <div className={cls("chat_box")}>
                <div className={cls("chat_header")}>
                    <img src="avatar.png" alt="" />
                    <div>Admin</div>
                </div>
                <div className={cls("chat_body")}></div>
                <div className={cls("chat_footer")}>
                    <form action="">
                        <input type="text" />
                        <button>Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Chat;
