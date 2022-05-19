import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface RequestAfterMDW extends Request {
    jwt_data: Object;
}

const authen = (request: Request, response: Response, next: NextFunction) => {
    const token = request.headers["x-jwt-token"] as string;
    if (token) {
        try {
            const jwt_data = verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            );
            (request as RequestAfterMDW).jwt_data = jwt_data;
            next();
        } catch (error) {
            return response.status(404).send({ result: "not authen" });
        }
    } else {
        return response.status(403).send({ result: "no token provied" });
    }
};

export default authen;
