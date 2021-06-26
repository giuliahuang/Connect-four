export default interface Message {
  readonly _id: string
  content: string
  users: string[]
  sender: string
}