import { UserInfo } from "./user";
interface FollowType {
    _id: string;
    user: string;
    followers: Array<UserInfo>;
    followings: Array<UserInfo>;
}

export default FollowType;
