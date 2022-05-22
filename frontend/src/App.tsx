import {useEffect} from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Login from "./components/account/Login";
import Register from "./components/account/Register";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import { getUserReload_thunk } from "./redux/user/thunk";
import Cookies from "js-cookie";

function App() {
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch()
    const refresh_token = Cookies.get('refresh_token')

    useEffect(() => {
        dispatch(getUserReload_thunk(refresh_token || ""));
    }, [dispatch, refresh_token]);

    return (
        <div className="App">
            {userState.isLogin && <Header />}
            <Routes>
                <Route
                    path="/"
                    element={
                        <PrivateRoute
                            Component={<Home />}
                            logits={userState.isLogin}
                            redirect="/login"
                        />
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/register"
                    element={
                        <PrivateRoute
                            Component={<Register />}
                            logits={!userState.isLogin}
                            redirect="/"
                        />
                    }
                />
            </Routes>
        </div>
    );
}

const PrivateRoute = ({ Component, logits, redirect }: any) => {
    return logits ? Component : <Navigate to={redirect} />;
};

export default App;
