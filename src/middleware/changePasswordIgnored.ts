import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET

export function changePasswordIgnored(req: Request, res: Response, next: NextFunction) {
    const lastPasswordChangeDate = new Date('2021-12-23');
    console.log(req.path);
    const token = req.headers.authorization;

    if (token &&
        (verifyToken(token) && 
        ((Date.now() - lastPasswordChangeDate.getTime()) > (1 * 24 * 60 * 60 * 1000)) &&
        req.path !== '/login')) {
        console.log('Token is undefined or invalid');
        res.redirect('https://onesandzeroes/users/update');
    } else {
        next();   
    }
}




function verifyToken(token: string): boolean {
    try {
        if (!JWT_SECRET) {
            return false;
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        return true;
    } catch (err) {
        return false;
    }
}
