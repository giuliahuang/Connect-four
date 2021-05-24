import mongoose from 'mongoose'
import crypto from 'crypto'
export interface User {
    username: string,
    mail: string,
    salt: string,    // salt is a random string that will be mixed with the actual password before hashing
    digest: string,  // this is the hashed password (digest of the password)
    roles: string[],
    friends?: string[]
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
        required: false
    },
    salt: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    digest: {
        type: mongoose.SchemaTypes.String,
        required: false
    },
    friends: {
        type: [mongoose.SchemaTypes.ObjectId],
        required: false
    }
})

export const userModel = mongoose.model('User', userSchema)

export async function setPassword(user: User, pwd: string) {
    user.salt = crypto.randomBytes(16).toString('hex') // We use a random 16-bytes hex string for salt

    // We use the hash function sha512 to hash both the password and salt to
    // obtain a password digest 
    // 
    // From wikipedia: (https://en.wikipedia.org/wiki/HMAC)
    // In cryptography, an HMAC (sometimes disabbreviated as either keyed-hash message 
    // authentication code or hash-based message authentication code) is a specific type 
    // of message authentication code (MAC) involving a cryptographic hash function and 
    // a secret cryptographic key.
    //
    const hmac = crypto.createHmac('sha512', user.salt)
    hmac.update(pwd)
    user.digest = hmac.digest('hex') // The final digest depends both by the password and the salt
    userModel.updateOne(user)
}

export function validatePassword(user: User, pwd: string): boolean {

    // To validate the password, we compute the digest with the
    // same HMAC to check if it matches with the digest we stored
    // in the database.
    //
    const hmac = crypto.createHmac('sha512', user.salt)
    hmac.update(pwd)
    const digest = hmac.digest('hex')
    return (user.digest === digest)
}

export function hasAdminRole(user: User): boolean {
    for (let roleidx in user.roles) {
        if (user.roles[roleidx] === 'ADMIN')
            return true
    }
    return false
}

export function setAdmin(user: User) {
    if (!hasAdminRole(user))
        user.roles.push("ADMIN")
}

export function hasModeratorRole(user: User): boolean {
    for (let roleidx in user.roles) {
        if (user.roles[roleidx] === 'MODERATOR')
            return true
    }
    return false
}

export function setModerator(user: User) {
    if (!hasModeratorRole(user))
        user.roles.push("MODERATOR")
}

export function newUser(data: User): Promise<User> {
    return new userModel(data)
}