import { Request, Response, NextFunction } from 'express'
import * as user from '../mongo/User'
import jwt = require('express-jwt')            // JWT parsing middleware for express
const result = require('dotenv').config()     // The dotenv module will load a file named ".env"
// file and load all the key-value pairs into
// process.env (environment variable)

if (result.error) {
  console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key")
  process.exit(-1)
}
if (!process.env.JWT_SECRET) {
  console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found")
  process.exit(-1)
}

var auth = jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] })
const getUsers = (req: Request, res: Response, next: NextFunction) => {

  user.getModel().find({}, { digest: 0, salt: 0 }).then((users) => {
    return res.status(200).json(users)
  }).catch((reason) => {
    return next({ statusCode: 404, error: true, errormessage: "DB error: " + reason })
  })

}

export default { getUsers }