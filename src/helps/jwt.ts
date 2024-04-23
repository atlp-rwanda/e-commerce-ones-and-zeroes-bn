// import jwt from "jsonwebtoken"

const jwt = require("jsonwebtoken")

export class JWT {
    static generateJwt(data: any, exp = "1d") {
      return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: exp });
    }
  }