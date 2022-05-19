export interface UserInfo {
    username: string;
    password: string;
    email: string;
    fullName: string;
    avatar: string;
}

export interface User {
    user: UserInfo | undefined;
    access_token: string;
    refresh_token: string;
}
