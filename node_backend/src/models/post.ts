import { model, Schema } from "mongoose";

interface Post {
    author: string;
    content: string;
    date_update: Date;
    images: Array<string>;
    comments: Array<any>;
    likes: Array<string>;
}

interface Comment {
    author: string;
    content: string;
    date: Date;
}

const commentSchema = new Schema<Comment>({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: Schema.Types.String },
    date: { type: Schema.Types.Date, default: Date.now },
});

const postSchema = new Schema<Post>({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: Schema.Types.String },
    date_update: { type: Schema.Types.Date, default: Date.now },
    images: { type: Schema.Types.Array },
    likes: { type: Schema.Types.Array, ref: "User" },
    comments: { type: Schema.Types.Array, of: commentSchema },
});

const PostModel = model<Post>("Post", postSchema);
export { Post, PostModel };
