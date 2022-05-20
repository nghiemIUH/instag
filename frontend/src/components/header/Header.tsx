import { useState, useEffect } from "react";
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
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/user/userSlice";
import { getNewToken_thunk, getUserReload_thunk } from "../../redux/user/thunk";
import Cookies from "js-cookie";

import style from "./header.module.scss";
const cls = classNames.bind(style);

function Header() {
    const [selectMenu, setSelectMenu] = useState("home");
    const userState = useAppSelector((state) => state.user);

    const dispatch = useAppDispatch();

    const handleLogOut = () => {
        dispatch(logout());
    };

    const refresh_token = Cookies.get("refresh_token") as string;
    useEffect(() => {
        dispatch(getUserReload_thunk(refresh_token || ""));
    }, [dispatch, refresh_token]);

    useEffect(() => {
        const minute = 1000 * 60 * 1;
        const interval = setInterval(() => {
            if (userState.isLogin) {
                dispatch(getNewToken_thunk(refresh_token || ""));
            }
        }, minute);

        return () => clearInterval(interval);
    });

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
                <img
                    src={
                        process.env.REACT_APP_URL +
                        "/static/avatars/" +
                        userState.user.avatar
                    }
                    alt=""
                />
                <div className={cls("sub_menu")}>
                    <div className={cls("profile")}>
                        <div>
                            <CgProfile /> Profile
                        </div>
                    </div>
                    <div>
                        <div onClick={handleLogOut}>
                            <AiOutlineLogout /> Logout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
