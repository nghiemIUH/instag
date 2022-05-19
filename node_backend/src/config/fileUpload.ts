import multer from "multer";
import { Request } from "express";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const avatarStorage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        cb(null, "./static/avatars/");
    },

    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        cb(
            null,
            new Date().toISOString().replace(/:/g, "-") + file.originalname
        );
    },
});

const avatarUpload = multer({ storage: avatarStorage });
export { avatarUpload };
