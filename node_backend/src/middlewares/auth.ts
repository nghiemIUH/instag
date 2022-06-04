import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

const authen = (request: Request, response: Response, next: NextFunction) => {
    let token = request.headers["authorization"] as string;

    if (token) {
        try {
            token = token.split(" ")[1];
            verify(token, process.env.ACCESS_TOKEN_SECRET as string);
            next();
        } catch (error) {
            return response.status(404).send({ result: "not authen" });
        }
    } else {
        return response.status(403).send({ result: "no token provied" });
    }
};

export default authen;
