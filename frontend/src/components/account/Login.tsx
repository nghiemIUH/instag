import { FormEvent, useState, useEffect } from "react";
import classNames from "classnames/bind";
import style from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { login_thunk } from "../../redux/user/thunk";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { changeRegister } from "../../redux/user/userSlice";

const cls = classNames.bind(style);

function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const dispatch = useAppDispatch();
    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        dispatch(login_thunk({ username, password }));
    };

    const userState = useAppSelector((state) => state.user);
    const rediect = useNavigate();

    useEffect(() => {
        if (userState.isLogin) {
            rediect("/");
        }
    }, [rediect, userState.isLogin]);

    useEffect(() => {
        dispatch(changeRegister());
    }, [dispatch]);

    return (
        <div className={cls("login")}>
            <img src="key-chain.png" alt="" />
            {userState.error ? (
                <div className={cls("error")}>
                    Username or password not invalid
                </div>
            ) : (
                <></>
            )}

            <form
                action=""
                style={{ width: "100%" }}
                onSubmit={(e) => handleLogin(e)}
            >
                <div className={cls("group")}>
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Username</label>
                    <span className={cls("bar")}></span>
                </div>
                <div className={cls("group")}>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className={cls("bar")}></span>
                    <label>Password</label>
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
