import { connect } from "mongoose";

const connectDB = async () => {
    await connect(process.env.MONGO_URL as string)
        .then((e) => {
            console.log("connected db");
        })
        .catch((error) => {
            console.log("connect error");
        });
};

export default connectDB;
