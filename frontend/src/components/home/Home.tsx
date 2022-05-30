import { memo } from "react";
import classNames from "classnames/bind";
import style from "./Home.module.scss";

// =========
import HomeLeft from "./HomeLeft";
import HomeRight from "./HomeRight";
const cls = classNames.bind(style);

function Home() {
    return (
        <div className={cls("home")}>
            <HomeLeft />
            <HomeRight />
        </div>
    );
}

export default memo(Home);
