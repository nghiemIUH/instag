import React from "react";
import classNames from "classnames/bind";
import style from "./Register.module.scss";
import { Link } from "react-router-dom";

const cls = classNames.bind(style);

function Register() {
    return (
        <div className={cls("register")}>
            <img src="personal.png" alt="" />
            <div className={cls("group")}>
                <label htmlFor="">Username</label>
                <input type="text" />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">Password</label>
                <input type="password" />
            </div>

            <div className={cls("group")}>
                <label htmlFor="">Email</label>
                <input type="email" />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">Full name</label>
                <input type="text" />
            </div>
            <div className={cls("group")}>
                <label htmlFor="">Avatar</label>
                <input type="file" />
            </div>
            <div className={cls("redirect")}>
                <Link to="/login">Login</Link>
            </div>
            <button>Register</button>
        </div>
    );
}

export default Register;
