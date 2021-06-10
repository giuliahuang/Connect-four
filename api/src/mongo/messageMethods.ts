import { MessageModel } from "./Message"
import UserModel from "./User"

export async function dm(message: string, senderUsername: string, destUsername: string): Promise<void> {
  const sender = await UserModel.findOne({ username: senderUsername })
  const dest = await UserModel.findOne({ username: destUsername })
  if (sender && dest && sender.friends.includes(dest.username)) {
    const newMessage = new MessageModel({
      content: message,
      users: [sender, dest],
      sender
    })
    await newMessage.save()
  }
}