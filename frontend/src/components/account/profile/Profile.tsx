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

const cls = classNames.bind(style);
function Profile() {
    const userState = useAppSelector((state) => state.user);
    const postState = useAppSelector((state) => state.post);
    const [openModal, setOpenModal] = useState(false);
    const [post, setPost] = useState<Array<Post>>([]);
    const [avatar, setAvatar] = useState<File | null>(null);

    const dispatch = useAppDispatch();

    useEffect(() => {
        const result = async () => {
            return await fetch(
                process.env.REACT_APP_URL + "/post/get-post-by-userid",
                {
                    method: "post",
                    headers: {
                        "content-type": "application/json",
                        Authorization: "Bearer " + userState.access_token,
                    },
                    body: JSON.stringify({ user_id: userState.user._id }),
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
    }, [postState]);

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

        dispatch(
            UserThunk.update()({
                data: formData,
                access_token: userState.access_token,
            })
        );
        if (!userState.error) {
            setOpenModal(false);
        }
    };

    return (
        <div className={cls("profile")}>
            <div className={cls("profile_info")}>
                <img
                    src={
                        process.env.REACT_APP_URL +
                        "/static/avatars/" +
                        userState.user.avatar
                    }
                    alt=""
                    className={cls("avatar")}
                />

                <div className={cls("user_info")}>
                    <div className={cls("user_info_row_1")}>
                        <div>{userState.user.username}</div>
                        <button
                            className={cls("btn_edit")}
                            onClick={() => setOpenModal(true)}
                        >
                            Edit profile
                        </button>
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
                        {userState.user.fullName}
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
                                                ? URL.createObjectURL(avatar)
                                                : process.env.REACT_APP_URL +
                                                  "/static/avatars/" +
                                                  userState.user.avatar
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
                                            const fileList = e.target.files;
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
        </div>
    );
}

export default Profile;
