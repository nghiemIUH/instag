import { FormEvent, useState, useEffect, memo } from "react";
import classNames from "classnames/bind";
import style from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import UserThunk from "../../../redux/user/thunk";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { changeRegister } from "../../../redux/user/userSlice";
import { RiKeyFill, RiShieldUserFill } from "react-icons/ri";

const cls = classNames.bind(style);

function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const dispatch = useAppDispatch();
    const handleLogin = (e: FormEvent) => {
        e.preventDefault();
        dispatch(UserThunk.login()({ username, password }));
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
                    <label>
                        <RiShieldUserFill />
                    </label>
                    <input
                        type="text"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <div className={cls("group")}>
                    <label>
                        <RiKeyFill />
                    </label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                    />
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

export default memo(Login);
