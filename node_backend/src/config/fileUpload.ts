import multer from "multer";
import { Request } from "express";
import { v4 } from "uuid";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const folderStorage = (folder: string) => {
    return multer.diskStorage({
        destination: (
            req: Request,
            file: Express.Multer.File,
            cb: DestinationCallback
        ) => {
            cb(null, "./static/" + folder);
        },

        filename: (
            req: Request,
            file: Express.Multer.File,
            cb: FileNameCallback
        ) => {
            cb(null, v4() + file.originalname);
        },
    });
};

const avatarUpload = multer({ storage: folderStorage("avatars") });
const postUpload = multer({ storage: folderStorage("post") });
export { avatarUpload, postUpload };
