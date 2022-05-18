import React from "react";
import classNames from "classnames/bind";
import style from "./Login.module.scss";
import { Link } from "react-router-dom";

const cls = classNames.bind(style);

function Login() {
    return (
        <div className={cls("login")}>
            <img src="key-chain.png" alt="" />
            <form action="" style={{ width: "100%" }}>
                <div className={cls("group")}>
                    <label htmlFor="">Username</label>
                    <input type="text" />
                </div>
                <div className={cls("group")}>
                    <label htmlFor="">Password</label>
                    <input type="password" />
                </div>
                <div className={cls("redirect")}>
                    <Link to="/">Forgot Password</Link>
                    <Link to="/register">Register</Link>
                </div>

                <button>Login</button>
            </form>
        </div>
    );
}

export default Login;
