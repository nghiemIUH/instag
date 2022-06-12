import { FormEvent, useEffect, useState } from "react";
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
import FollowThunk from "../../../redux/follow/thunk";

const cls = classNames.bind(style);
function Profile() {
    const location = useLocation();
    const username = location.pathname.split("/")[2];
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector((state) => state.user);
    const [userState, setUserState] = useState<UserInfo | null>(
        currentUser.user.username === username ? currentUser.user : null
    );

    const followState = useAppSelector((state) => state.follow);

    const postState = useAppSelector((state) => state.post);
    const [openModal, setOpenModal] = useState(false);
    const [post, setPost] = useState<Array<Post>>([]);
    const [avatar, setAvatar] = useState<File | null>(null);

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
                setUserState({ ...response.data.user });
            });
        } else {
            setUserState(currentUser.user);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    useEffect(() => {
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
                setPost(data.posts);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postState, username]);

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

    const handleFollow = async () => {
        dispatch(
            FollowThunk.follow_unfollow()({
                access_token: currentUser.access_token,
                current_username: currentUser.user.username,
                other_username: username,
            })
        );
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
                                        onClick={handleFollow}
                                    >
                                        {followState.follow?.followers
                                            ?.map((value) => {
                                                return value.username;
                                            })
                                            .includes(username)
                                            ? "Unfollow"
                                            : "Follow"}
                                    </button>
                                )}
                            </div>
                            <div className={cls("user_info_row_2")}>
                                <div>
                                    <span>0</span> post
                                </div>
                                <div>
                                    <span>0</span> followers
                                </div>
                                <div>
                                    <span>0</span> following
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

export default Profile;
