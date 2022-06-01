import { useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { register_thunk } from "../../../redux/user/thunk";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useState } from "react";
import {
    RiKeyFill,
    RiShieldUserFill,
    RiAccountCircleFill,
} from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { BiImageAdd } from "react-icons/bi";

interface UserData {
    username: string;
    password: string;
    email: string;
    avatar?: File | null;
    fullName: string;
}

const cls = classNames.bind(style);
function Register() {
    const [data, setData] = useState<UserData>({
        username: "",
        password: "",
        email: "",
        avatar: null,
        fullName: "",
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState({
        username: "",
        password: "",
        password_cf: "",
        email: "",
        avatar: "",
        fullName: "",
    });

    const dispatch = useAppDispatch();
    const redirect = useNavigate();
    const userState = useAppSelector((state) => state.user);

    useEffect(() => {
        if (userState.isRegister) {
            redirect("/login");
        }
    }, [redirect, userState.isRegister]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleValidate = () => {
        if (data.username.length < 6) {
            setError((prev) => {
                return { ...prev, username: "Username must be > 6 character" };
            });
        } else {
            setError((prev) => {
                return { ...prev, username: "" };
            });
        }

        if (data.password.length < 6) {
            setError((prev) => {
                return { ...prev, password: "Password must be > 6 character" };
            });
        } else {
            setError((prev) => {
                return { ...prev, password: "" };
            });
        }

        const password_cf = document.getElementById(
            "password_cf"
        ) as HTMLInputElement;

        if (data.password !== password_cf.value) {
            setError((prev) => {
                return {
                    ...prev,
                    password_cf: "Password and password confirm not correct",
                };
            });
        } else {
            setError((prev) => {
                return { ...prev, password_cf: "" };
            });
        }

        if (data.fullName.length === 0) {
            setError((prev) => {
                return {
                    ...prev,
                    fullName: "Full name not empty",
                };
            });
        } else {
            setError((prev) => {
                return { ...prev, fullName: "" };
            });
        }

        if (!data.avatar) {
            setError((prev) => {
                return {
                    ...prev,
                    avatar: "Avatars not empty",
                };
            });
        } else {
            setError((prev) => {
                return { ...prev, avatar: "" };
            });
        }

        if (data.email.length === 0) {
            setError((prev) => {
                return {
                    ...prev,
                    email: "Email not empty",
                };
            });
        } else {
            setError((prev) => {
                return { ...prev, email: "" };
            });
        }
    };

    const handleClick = () => {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("password", data.password);
        formData.append("email", data.email);
        formData.append("fullName", data.fullName);
        formData.append("avatar", data.avatar as File, data.avatar?.name);

        dispatch(register_thunk(formData));
    };
    return (
        <div className={cls("register")}>
            <div className={cls("group")}>
                <label htmlFor="">
                    <RiShieldUserFill />
                </label>
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    onChange={(e) => {
                        setData((prev) => {
                            return { ...prev, username: e.target.value };
                        });
                    }}
                />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">
                    <RiKeyFill />
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) => {
                        setData((prev) => {
                            return { ...prev, password: e.target.value };
                        });
                    }}
                />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">
                    <RiKeyFill />
                </label>
                <input
                    type="password"
                    id="password_cf"
                    placeholder="Password"
                />
            </div>

            <div className={cls("group")}>
                <label htmlFor="">
                    <MdEmail />
                </label>
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) => {
                        setData((prev) => {
                            return { ...prev, email: e.target.value };
                        });
                    }}
                />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">
                    <RiAccountCircleFill />
                </label>
                <input
                    type="text"
                    id="fullName"
                    placeholder="Full name"
                    onChange={(e) => {
                        setData((prev) => {
                            return { ...prev, fullName: e.target.value };
                        });
                    }}
                />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">
                    <BiImageAdd />
                </label>
                <input
                    type="file"
                    id="avatar"
                    accept=".gif,.jpg,.jpeg,.png"
                    onChange={(e) => {
                        const fileList = e.target.files;
                        if (!fileList) return;
                        setData((prev) => {
                            return { ...prev, avatar: fileList[0] };
                        });
                    }}
                />
            </div>
            <div className={cls("redirect")}>
                <Link to="/login">Login</Link>
            </div>
            <button onClick={handleClick}>Register</button>
        </div>
    );
}

export default Register;
