import { useEffect } from "react";
import "./App.css";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import Login from "./components/account/login/Login";
import Register from "./components/account/register/Register";
import { useAppSelector, useAppDispatch } from "./redux/hooks";
import UserThunk from "./redux/user/thunk";
import Profile from "./components/account/profile/Profile";
import Cookies from "js-cookie";
import Chat from "./components/chat/Chat";
function App() {
    const userState = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const refresh_token = Cookies.get("refresh_token");
        dispatch(UserThunk.getUserReload()(refresh_token || ""));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="App">
            {userState.isLoading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <Header />
                    <Routes>
                        <Route
                            element={
                                <PrivateRoutes isLogin={userState.isLogin} />
                            }
                        >
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/profile/:username"
                                element={<Profile />}
                            />
                            <Route path="/chat" element={<Chat />} />
                        </Route>

                        <Route element={<Login />} path="/login" />
                        <Route element={<Register />} path="/register" />
                    </Routes>
                </>
            )}
        </div>
    );
}

interface PrivateRouteType {
    isLogin: boolean;
}

const PrivateRoutes = ({ isLogin }: PrivateRouteType) => {
    return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default App;
