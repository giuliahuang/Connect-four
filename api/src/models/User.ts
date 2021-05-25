import mongoose from 'mongoose'
import { genPassword, validatePassword as vpwd } from '../utils/passwordUtils'

export interface User {
    readonly _id: string,
    username: string,
    email: string,
    salt: string,    // salt is a random string that will be mixed with the actual password before hashing
    hash: string,  // this is the hashed password (digest of the password)
    roles: string[],
    friends: string[]
}

const userSchema = new mongoose.Schema<User>({
    username: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.String,
        required: true,
        unique: true
    },
    roles: {
        type: [mongoose.SchemaTypes.String],
        required: true
    },
    salt: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    hash: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    friends: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: true
    }
})

export const UserModel = mongoose.model<User>('User', userSchema)

export async function setPassword(user: User, pwd: string) {
    const pwdObj = genPassword(pwd)
    UserModel.findOneAndUpdate({ email: user.email }, { hash: pwdObj.hash, salt: pwdObj.salt })
}

export function validatePassword(user: User, pwd: string): boolean {
    return vpwd(pwd, user.hash, user.salt)
}

export function hasAdminRole(user: User): boolean {
    return user.roles.includes('ADMIN')
}

export async function setAdmin(user: User) {
    if (!hasAdminRole(user)) {
        await UserModel.findOneAndUpdate({ email: user.email }, { $push: { roles: 'ADMIN' } })
    }
}

export function hasModeratorRole(user: User): boolean {
    return user.roles.includes('MODERATOR')
}

export async function setModerator(user: User) {
    if (!hasModeratorRole(user))
        await UserModel.findOneAndUpdate({ email: user.email }, { $push: { roles: 'MODERATOR' } })
}

export async function newUser(username: string, email: string, password: string): Promise<User & mongoose.Document<any, any>> {
    const pwdObj = genPassword(password)
    const doc = new UserModel({
        username: username,
        email: email,
        roles: [],
        salt: pwdObj.salt,
        hash: pwdObj.hash,
        friends: []
    })
    return await doc.save()
}