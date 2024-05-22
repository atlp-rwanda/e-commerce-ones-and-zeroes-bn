import { Request, Response } from "express"
const jwt = require("jsonwebtoken")

interface customRequest extends Request {
    token?: any,

}
export default class authMiddleWares {


    static async isAuthenticated(req: customRequest, res: Response, next: any) {
        try {
            const { authorization } = req.headers;
            if (!authorization) {
                return res.status(403).json({
                    status: "fail",
                    message: "Missing authorization token",
                });
            }

            const token = authorization.split(" ")[1];
            if (!token) {
                return res.status(403).json({
                    status: "fail",
                    message: "unauthorized action",
                });
            }

            req.token = token;
            next()

        } catch (e) {
            return res.status(500).json({
                status: "error",
                message: "something went wrong: " + e
            })
        }
    }
}