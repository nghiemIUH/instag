export interface UserInfo {
    _id: string;
    username: string;
    password?: string;
    email?: string;
    fullName?: string;
    avatar?: string;
}

export interface User {
    user: UserInfo;
    access_token: string;
    refresh_token: string;
}
