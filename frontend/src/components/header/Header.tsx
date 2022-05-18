import { useState } from "react";
import classNames from "classnames/bind";
import { BsSearch } from "react-icons/bs";
import {
    AiOutlineHome,
    AiOutlineMessage,
    AiOutlineCompass,
    AiOutlineHeart,
    AiOutlineLogout,
} from "react-icons/ai";
import { BiMessageAltAdd } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";

// ====================
import style from "./header.module.scss";
const cls = classNames.bind(style);

function Header() {
    const [selectMenu, setSelectMenu] = useState("home");

    return (
        <div className={cls("header")}>
            <div className={cls("logo")}>Instag</div>
            <div className={cls("search")}>
                <BsSearch />
                <input type="text" placeholder="Search" />
            </div>
            <div className={cls("menu")}>
                <AiOutlineHome
                    style={{ color: selectMenu === "home" ? "red" : "black" }}
                    onClick={() => setSelectMenu("home")}
                />
                <AiOutlineMessage
                    style={{ color: selectMenu === "mess" ? "red" : "black" }}
                    onClick={() => setSelectMenu("mess")}
                />
                <BiMessageAltAdd
                    style={{ color: selectMenu === "add" ? "red" : "black" }}
                    onClick={() => setSelectMenu("add")}
                />
                <AiOutlineCompass
                    style={{
                        color: selectMenu === "compass" ? "red" : "black",
                    }}
                    onClick={() => setSelectMenu("compass")}
                />
                <AiOutlineHeart
                    style={{ color: selectMenu === "heart" ? "red" : "black" }}
                    onClick={() => setSelectMenu("heart")}
                />
            </div>
            <div className={cls("avatar")}>
                <img src="avatar.png" alt="" />
                <div className={cls("sub_menu")}>
                    <div className={cls("profile")}>
                        <Link to="/profile">
                            <CgProfile /> Profile
                        </Link>
                    </div>
                    <div>
                        <Link to="/login">
                            <AiOutlineLogout /> Logout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
