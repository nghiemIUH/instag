import { useState, useEffect, useContext } from "react";
import classNames from "classnames/bind";
import { BsSearch } from "react-icons/bs";
import { AiOutlineHome, AiOutlineMessage } from "react-icons/ai";
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
import SocketContext from "../../context/socket";
import { Socket } from "socket.io-client";
import axiosConfig from "../../configs/axiosConfig";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
const cls = classNames.bind(style);

interface SearchResultType {
    username: string;
    avatar: string;
    fullName: string;
}

interface SocketContextType {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

function Header() {
    const { socket } = useContext(SocketContext) as SocketContextType;
    const [selectMenu, setSelectMenu] = useState("home");
    const [inputSearch, setInputSearch] = useState<string>("");
    const valueSearch = useSearchHook(inputSearch, 500) as string;
    const [searchResult, setSearchResult] = useState<Array<SearchResultType>>(
        []
    );
    const [showNotify, setShowNotify] = useState(false);
    const userState = useAppSelector((state) => state.user);
    const [notify, setNotify] = useState<Array<any>>([]);
    let count_notify = 0;
    for (const i of notify) {
        if (!i.seen) {
            count_notify++;
        }
    }

    const dispatch = useAppDispatch();

    const handleLogOut = () => {
        dispatch(logout());
    };

    useEffect(() => {
        const getNoti = async () => {
            return await axiosConfig({
                isFormData: false,
                access_token: userState.access_token,
            })({
                url: "/user/get-notify",
                method: "post",
                data: JSON.stringify({ username: userState.user.username }),
            });
        };
        getNoti().then((response) => {
            setNotify(response.data.notify);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket?.on("notify", (data) => {
            setNotify((prev) => {
                return [...prev, data];
            });
        });
        socket?.on("ac_friend_notify", (data) => {
            if (userState.user.username === data.username_1)
                toast(`${data.fullName} is accepted friend`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
        });
    }, [socket, userState.user.username]);

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

    useEffect(() => {
        const closeNotify = (e: Event) => {
            // notify
            const notify_element = document.getElementById(
                "notify"
            ) as HTMLDivElement;
            if (!notify_element.contains(e.target as Node)) {
                setShowNotify(false);
            }
        };

        document.addEventListener("click", closeNotify);
        return () => document.removeEventListener("click", closeNotify);
    }, []);

    const [modalIsOpen, setIsOpen] = useState(false);
    function openModal() {
        setIsOpen(true);
    }
    function closeModal() {
        setIsOpen(false);
    }

    const seenNotify = async () => {
        await axiosConfig({
            isFormData: false,
            access_token: userState.access_token,
        })({
            url: "/user/seen-notify",
            method: "post",
            data: JSON.stringify({ username: userState.user.username }),
        }).then((response) => {
            setShowNotify((prev) => !prev);
            setNotify((prev) => {
                const newState = prev.map((value) => {
                    return { ...value, seen: true };
                });
                return newState;
            });
        });
    };

    const denyFriend = async (username_1: string) => {
        await axiosConfig({
            isFormData: false,
            access_token: userState.access_token,
        })({
            url: "/user/cancel-friendship",
            method: "post",
            data: JSON.stringify({
                username_1,
                username_2: userState.user.username,
            }),
        }).then((response) => {
            setNotify(response.data.notify);
        });
    };

    const acceptFriend = async (username_1: string) => {
        await axiosConfig({
            isFormData: false,
            access_token: userState.access_token,
        })({
            url: "/user/add-friend",
            method: "post",
            data: JSON.stringify({
                username_1,
                username_2: userState.user.username,
            }),
        }).then((response) => {
            socket?.emit("accept-friend", {
                username_1,
                username_2: userState.user.username,
                fullName: userState.user.fullName,
            });
            setNotify(response.data.notify);
        });
    };

    return (
        <div className={cls("header")}>
            <ToastContainer />
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
                        disabled={!userState.isLogin}
                    />
                </div>

                {inputSearch.length > 0 && (
                    <div className={cls("search_result")} id="search_result">
                        {searchResult.length > 0 ? (
                            searchResult?.map((value, index) => {
                                return (
                                    <Link
                                        className={cls("result_item")}
                                        key={index}
                                        to={"/profile/" + value.username}
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
                                            <div>{value.username}</div>
                                            <div>{value.fullName}</div>
                                        </div>
                                    </Link>
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
                <Link to="/chat">
                    <AiOutlineMessage
                        style={{
                            color: selectMenu === "mess" ? "red" : "black",
                        }}
                        onClick={() => setSelectMenu("mess")}
                    />
                </Link>

                <BiMessageAltAdd
                    style={{ color: selectMenu === "add" ? "red" : "black" }}
                    onClick={openModal}
                />
                <UploadPost modalIsOpen={modalIsOpen} closeModal={closeModal} />
                <div className={cls("notify")}>
                    <AiOutlineUsergroupAdd
                        onClick={() => {
                            seenNotify();
                        }}
                    />
                    <div
                        className={cls("notify_menu")}
                        style={{
                            display: showNotify ? "block" : "none",
                        }}
                    >
                        {notify.length === 0 ? (
                            <div
                                style={{
                                    fontSize: "1rem",
                                    display: "flex",
                                }}
                                id="notify"
                            >
                                Not found
                            </div>
                        ) : (
                            notify.map((value, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={cls("notify_item")}
                                    >
                                        <div className={cls("user_info")}>
                                            <img
                                                src={
                                                    process.env.REACT_APP_URL +
                                                    "/static/avatars/" +
                                                    value.event.user_1.avatar
                                                }
                                                alt=""
                                            />
                                            <div>
                                                {value.event.user_1.username}
                                            </div>
                                        </div>
                                        <div className={cls("notify_confirm")}>
                                            <button
                                                onClick={() =>
                                                    acceptFriend(
                                                        value.event.user_1
                                                            .username
                                                    )
                                                }
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() =>
                                                    denyFriend(
                                                        value.event.user_1
                                                            .username
                                                    )
                                                }
                                            >
                                                Deny
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className={cls("num_notify")}>{count_notify}</div>
                </div>
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
                        <Link to={"/profile/" + userState.user.username}>
                            Profile
                        </Link>
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
