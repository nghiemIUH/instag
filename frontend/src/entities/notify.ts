import { User } from "./user";

interface Notifytype {
    _id: string;
    user: User;
    type: string;
    seen: boolean;
    event: string;
    date: Date;
}

export default Notifytype;
