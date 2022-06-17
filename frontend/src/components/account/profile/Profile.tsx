import { FormEvent, useEffect, useState, useContext, memo } from "react";
import classNames from "classnames/bind";
import { useAppSelector } from "../../../redux/hooks";
import style from "./Profile.module.scss";
import { Post } from "../../../entities/post";
import PostItem from "../../home/post/PostItem";
import { MdEmail, MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { useAppDispatch } from "../../../redux/hooks";
import UserThunk from "../../../redux/user/thunk";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { UserInfo } from "../../../entities/user";
import axiosConfig from "../../../configs/axiosConfig";
import SocketContext from "../../../context/socket";
import { Socket } from "socket.io-client";

const cls = classNames.bind(style);
interface FriendType {
    user: UserInfo;
    friend: Array<UserInfo>;
}

interface SocketContextType {
    socket: Socket | null;
    connect: () => void;
    disconnect: () => void;
}

function Profile() {
    const { socket } = useContext(SocketContext) as SocketContextType;
    const location = useLocation();
    const username = location.pathname.split("/")[2];
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector((state) => state.user);
    const [userState, setUserState] = useState<UserInfo | null>(
        currentUser.user.username === username ? currentUser.user : null
    );
    const [friend, setFriend] = useState<FriendType | null>(null);
    const [friendShip, setFriendShip] = useState<any>(null);

    const [openModal, setOpenModal] = useState(false);
    const [post, setPost] = useState<Array<Post>>([]);
    const [avatar, setAvatar] = useState<File | null>(null);
    console.log("render");

    useEffect(() => {
        if (username !== currentUser.user.username) {
            const result = async () => {
                return await axiosConfig({
                    isFormData: false,
                    access_token: currentUser.access_token,
                })({
                    method: "post",
                    url: "/user/find-user-profile",
                    data: JSON.stringify({ username }),
                });
            };
            result().then((response) => {
                setUserState((prev) => response.data.user);
            });
        } else {
            setUserState((prev) => currentUser.user);
        }

        const getFriendShip = async () => {
            return await axiosConfig({
                isFormData: false,
                access_token: currentUser.access_token,
            })({
                url: "/user/get-friendship",
                method: "post",
                data: JSON.stringify({
                    username_1: currentUser.user.username,
                    username_2: username,
                }),
            });
        };
        getFriendShip()
            .then((response) => {
                setFriendShip(response.data.friendShip);
            })
            .catch((error) => {
                console.log(error);
            });

        const getFriend = async () => {
            return await axiosConfig({
                isFormData: false,
                access_token: currentUser.access_token,
            })({
                url: "/user/get-friend",
                method: "post",
                data: JSON.stringify({ username: currentUser.user.username }),
            });
        };
        getFriend()
            .then((response) => {
                setFriend(response.data.friend);
            })
            .catch((error) => {
                console.log(error);
            });

        const result = async () => {
            return await fetch(
                process.env.REACT_APP_URL + "/post/get-post-by-userid",
                {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + currentUser?.access_token,
                    },
                    body: JSON.stringify({ username: username }),
                }
            );
        };
        result()
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setPost((prev) => data.posts);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        socket?.on("get-friendship", (data) => {
            setFriendShip(data);
        });

        socket?.on("ac_friend_notify", (data) => {
            console.log("run");

            setFriend((prev) => {
                const newState = prev;
                if (currentUser.user.username === data.username_1)
                    newState?.friend.push({
                        username: data.username_2,
                    } as UserInfo);
                else
                    newState?.friend.push({
                        username: data.username_1,
                    } as UserInfo);
                return newState;
            });
            setFriendShip(null);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    const handleEditProfile = async (e: FormEvent) => {
        e.preventDefault();
        const password = (
            document.getElementById("password") as HTMLInputElement
        ).value;
        const email = (document.getElementById("email") as HTMLInputElement)
            .value;

        const fullName = (
            document.getElementById("fullName") as HTMLInputElement
        ).value;

        if (
            password.length === 0 &&
            email.length === 0 &&
            fullName.length === 0 &&
            !avatar
        ) {
            return;
        }

        const formData = new FormData();
        if (password.length > 0) {
            formData.append("password", password);
        }
        if (email.length > 0) {
            formData.append("email", email);
        }
        if (fullName.length > 0) {
            formData.append("fullName", fullName);
        }
        if (avatar) {
            formData.append("avatar", avatar as File, avatar?.name);
        }

        if (userState) {
            formData.append("username", currentUser.user.username);
        }

        dispatch(
            UserThunk.update()({
                data: formData,
                access_token: currentUser?.access_token as string,
            })
        );
        if (!currentUser?.error) {
            setOpenModal(false);
            notify();
        }
    };

    const notify = () => {
        toast.success("Success", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
        });
    };

    const handleFriendShip = async () => {
        socket?.emit("create-friendship", {
            username_1: currentUser.user.username,
            username_2: userState?.username,
        });
    };
    const handleCancelFriend = async () => {
        await axiosConfig({
            isFormData: false,
            access_token: currentUser.access_token,
        })({
            url: "/user/cancel-friendship",
            method: "post",
            data: JSON.stringify({
                username_1: currentUser.user.username,
                username_2: username,
            }),
        });
        setFriendShip(null);
    };

    const handleUnFriend = async () => {
        await axiosConfig({
            isFormData: false,
            access_token: currentUser.access_token,
        })({
            url: "/user/unfriend",
            method: "post",
            data: JSON.stringify({
                username_1: currentUser.user.username,
                username_2: username,
            }),
        }).then((response) => {
            setFriend(response.data.friend);
        });
    };

    return (
        <div className={cls("profile")}>
            {!userState ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div className={cls("profile_info")}>
                        <img
                            src={
                                process.env.REACT_APP_URL +
                                "/static/avatars/" +
                                userState?.avatar
                            }
                            alt=""
                            className={cls("avatar")}
                        />

                        <div className={cls("user_info")}>
                            <div className={cls("user_info_row_1")}>
                                <div>{userState?.username}</div>
                                {currentUser.user.username === username ? (
                                    <button
                                        className={cls("btn_edit")}
                                        onClick={() => setOpenModal(true)}
                                    >
                                        Edit profile
                                    </button>
                                ) : (
                                    <button
                                        className={cls("btn_follow")}
                                        onClick={
                                            friendShip
                                                ? handleCancelFriend
                                                : friend?.friend
                                                      .map((value) => {
                                                          return value.username;
                                                      })
                                                      .includes(username)
                                                ? handleUnFriend
                                                : handleFriendShip
                                        }
                                    >
                                        {friendShip
                                            ? "Cancel invitation"
                                            : friend?.friend
                                                  .map((value) => {
                                                      return value.username;
                                                  })
                                                  .includes(username)
                                            ? "UnFriend"
                                            : "Add friend"}
                                    </button>
                                )}
                            </div>
                            <div className={cls("user_info_row_2")}>
                                <div>
                                    <span>{post.length}</span> Post
                                </div>
                                <div>
                                    <span>{friend?.friend.length}</span> Friend
                                </div>
                            </div>

                            <div className={cls("user_info_row_3")}>
                                {userState?.fullName}
                            </div>
                        </div>
                    </div>
                    <div className={cls("break")}></div>
                    <div className={cls("posts")}>
                        {post.map((value, index) => {
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
                    <ToastContainer
                        position="top-right"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover={false}
                    />
                    {openModal && (
                        <div className={cls("modal")}>
                            <div className={cls("modal_content")}>
                                <div
                                    className={cls("modal_close")}
                                    onClick={() => setOpenModal(false)}
                                >
                                    &times;
                                </div>
                                <div className={cls("modal_body")}>
                                    <form
                                        className={cls("form_edit")}
                                        onSubmit={(e) => handleEditProfile(e)}
                                    >
                                        <div className={cls("form_group")}>
                                            <img
                                                src={
                                                    avatar
                                                        ? URL.createObjectURL(
                                                              avatar
                                                          )
                                                        : process.env
                                                              .REACT_APP_URL +
                                                          "/static/avatars/" +
                                                          userState?.avatar
                                                }
                                                alt=""
                                            />
                                            <label htmlFor="channe_avatar">
                                                Change avatar
                                            </label>
                                            <input
                                                type="file"
                                                accept=".gif,.jpg,.jpeg,.png"
                                                id="channe_avatar"
                                                hidden
                                                onChange={(e) => {
                                                    const fileList =
                                                        e.target.files;
                                                    if (!fileList) return;
                                                    setAvatar(fileList[0]);
                                                }}
                                            />
                                        </div>
                                        <div className={cls("form_group")}>
                                            <label htmlFor="">
                                                <RiLockPasswordLine />
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                id="password"
                                            />
                                        </div>
                                        <div className={cls("form_group")}>
                                            <label htmlFor="">
                                                <RiLockPasswordLine />
                                            </label>
                                            <input
                                                type="password"
                                                placeholder="Confirm password"
                                            />
                                        </div>

                                        <div className={cls("form_group")}>
                                            <label htmlFor="">
                                                <MdEmail />
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Email"
                                                id="email"
                                            />
                                        </div>
                                        <div className={cls("form_group")}>
                                            <label htmlFor="">
                                                <MdOutlineDriveFileRenameOutline />
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Full name"
                                                id="fullName"
                                            />
                                        </div>
                                        <div className={cls("form_submit")}>
                                            <button>Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default memo(Profile);
