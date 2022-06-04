import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { BsSearch } from "react-icons/bs";
import {
    AiOutlineHome,
    AiOutlineMessage,
    AiOutlineCompass,
} from "react-icons/ai";
import { BiMessageAltAdd } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/user/userSlice";
import { Link } from "react-router-dom";
import UserThunk from "../../redux/user/thunk";
import Cookies from "js-cookie";
import style from "./header.module.scss";
import UploadPost from "./UploadPost";
import "tippy.js/dist/tippy.css";
import "tippy.js/themes/material.css";
import "tippy.js/animations/scale-subtle.css";

const cls = classNames.bind(style);

interface SearchResultType {
    username: string;
    avatar: string;
    fullName: string;
}

function Header() {
    const [selectMenu, setSelectMenu] = useState("home");
    const [inputSearch, setInputSearch] = useState<string>("");
    const valueSearch = useSearchHook(inputSearch, 500) as string;
    const [searchResult, setSearchResult] = useState<Array<SearchResultType>>(
        []
    );
    const userState = useAppSelector((state) => state.user);

    const dispatch = useAppDispatch();

    const handleLogOut = () => {
        dispatch(logout());
    };

    useEffect(() => {
        const refresh_token = Cookies.get("refresh_token") as string;

        const minute = 1000 * 60 * 3;
        const interval = setInterval(() => {
            if (userState.isLogin) {
                dispatch(UserThunk.getNewToken()(refresh_token || ""));
            }
        }, minute);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const url =
            process.env.REACT_APP_URL +
            "/user/search?" +
            new URLSearchParams({ search: valueSearch });

        if (valueSearch.length > 0) {
            const result = async () => {
                const data = await fetch(url, {
                    method: "get",
                    headers: {
                        "content-type": "application/json",
                    },
                });
                return data.json();
            };

            result()
                .then((e) => {
                    setSearchResult(e);
                })
                .catch((error) => {});
        }
    }, [valueSearch]);

    useEffect(() => {
        const closeOutSide = (event: Event) => {
            if (inputSearch.length > 0) {
                const search_result = document.getElementById(
                    "search_result"
                ) as HTMLDivElement;
                const isContain = search_result.contains(event.target as Node);
                if (!isContain) {
                    setInputSearch((prev) => "");
                    setSearchResult((prev) => []);
                    // eslint-disable-next-line react-hooks/exhaustive-deps
                }
            }
        };

        document.addEventListener("click", closeOutSide);
        return () => document.removeEventListener("click", closeOutSide);
    }, [inputSearch]);

    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    return (
        <div className={cls("header")}>
            <div className={cls("logo")}>Instag</div>
            <div className={cls("search")} id="search">
                <div className={cls("search_input")}>
                    <BsSearch />
                    <input
                        type="text"
                        placeholder="Search"
                        id="search_input"
                        autoComplete="off"
                        onChange={(e) => {
                            setInputSearch(e.target.value.trim());
                        }}
                        disabled={userState.isLogin}
                    />
                </div>

                {inputSearch.length > 0 && (
                    <div className={cls("search_result")} id="search_result">
                        {searchResult.length > 0 ? (
                            searchResult?.map((value, index) => {
                                return (
                                    <div
                                        className={cls("result_item")}
                                        key={index}
                                    >
                                        <img
                                            src={
                                                process.env.REACT_APP_URL +
                                                "/static/avatars/" +
                                                value.avatar
                                            }
                                            alt=""
                                        />
                                        <div
                                            className={cls("result_user_name")}
                                        >
                                            <div>
                                                <a href="https://google.com">
                                                    {value.username}
                                                </a>
                                            </div>
                                            <div>{value.fullName}</div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className={cls("search_not_found")}>
                                Not found
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={cls("menu")}>
                <Link to="/">
                    <AiOutlineHome
                        style={{
                            color: selectMenu === "home" ? "red" : "black",
                        }}
                        onClick={() => setSelectMenu("home")}
                    />
                </Link>
                <AiOutlineMessage
                    style={{ color: selectMenu === "mess" ? "red" : "black" }}
                    onClick={() => setSelectMenu("mess")}
                />
                <BiMessageAltAdd
                    style={{ color: selectMenu === "add" ? "red" : "black" }}
                    onClick={openModal}
                />
                <UploadPost modalIsOpen={modalIsOpen} closeModal={closeModal} />
                <AiOutlineCompass
                    style={{
                        color: selectMenu === "compass" ? "red" : "black",
                    }}
                    onClick={() => setSelectMenu("compass")}
                />
            </div>

            {userState.isLogin && (
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
                        <Link to="/profile">Profile</Link>
                        <Link to="/login" onClick={handleLogOut}>
                            Logout
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;

const useSearchHook = (value: string, delay: number) => {
    const [valueDelay, setValueDelay] = useState<string>("");
    useEffect(() => {
        const lastTimeout = setTimeout(() => {
            setValueDelay(value);
        }, delay);

        return () => clearTimeout(lastTimeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return valueDelay;
};
