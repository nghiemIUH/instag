interface Comment {
    author: string;
    content: string;
    date: Date;
}

interface Author {
    username: string;
    avatar: string;
}

export interface Post {
    _id: string;
    author: Author;
    content: string;
    date_update: Date;
    images: Array<string>;
    likes: Array<string>;
    comments: Array<Comment>;
}
