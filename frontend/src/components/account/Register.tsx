import { useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Register.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { register_thunk } from "../../redux/user/thunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { ChangeEvent, useState } from "react";

const cls = classNames.bind(style);
function Register() {
    const [avatar, setAvatar] = useState<File>();
    const dispatch = useAppDispatch();
    const redirect = useNavigate();
    const userState = useAppSelector((state) => state.user);

    useEffect(() => {
        if (userState.isRegister) {
            redirect("/login");
        }
    }, [redirect, userState.isRegister]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;
        setAvatar(fileList[0]);
    };

    const handleClick = () => {
        const username = document.getElementById(
            "username"
        ) as HTMLInputElement;
        const password = document.getElementById(
            "password"
        ) as HTMLInputElement;
        // const password_cf = document.getElementById("password_cf");
        const email = document.getElementById("email") as HTMLInputElement;
        const fullName = document.getElementById(
            "fullName"
        ) as HTMLInputElement;

        const formData = new FormData();
        formData.append("username", username.value);
        formData.append("password", password.value);
        formData.append("email", email.value);
        formData.append("fullName", fullName.value);
        formData.append("avatar", avatar as File, avatar?.name);

        dispatch(register_thunk(formData));
    };
    return (
        <div className={cls("register")}>
            <img src="personal.png" alt="" />
            <div className={cls("group")}>
                <label htmlFor="">Username</label>
                <input type="text" id="username" />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">Password</label>
                <input type="password" id="password" />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">Password confirm</label>
                <input type="password" id="password_cf" />
            </div>

            <div className={cls("group")}>
                <label htmlFor="">Email</label>
                <input type="email" id="email" />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">Full name</label>
                <input type="text" id="fullName" />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">Avatar</label>
                <input
                    type="file"
                    id="avatar"
                    accept=".gif,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e)}
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
