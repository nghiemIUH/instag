import { useEffect } from "react";
import classNames from "classnames/bind";
import style from "./HomeLeft.module.scss";
import PostItem from "./PostItem";
import Story from "./Story";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import PostThunk from "../../redux/post/thunk";

const cls = classNames.bind(style);

function HomeLeft() {
    const postState = useAppSelector((state) => state.post);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(PostThunk.getAllPost()());
    }, [dispatch]);

    return (
        <div className={cls("home_left")}>
            <Story />
            {postState.post.map((value, index) => {
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
    );
}

export default HomeLeft;
