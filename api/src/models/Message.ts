import User from "./User"

export default interface Message {
  readonly _id: string
  content: string
  users: User[]
  sender: User
}