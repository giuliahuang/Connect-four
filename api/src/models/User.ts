export default interface User {
    readonly _id: string,
    username: string,
    email: string,
    salt: string,
    hash: string,
    roles: string[],
    mmr: number,
    friends: string[]
}