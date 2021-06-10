export default interface Message {
  readonly _id: string
  content: string
  userIds: string[]
  senderId: string
}