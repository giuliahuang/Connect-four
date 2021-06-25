import logger from "../logger"
import { MessageModel } from "./Message"
import UserModel from "./User"

/**
 * If the two users are friends the message gets stored and persisted into the database
 * @param message Message content
 * @param senderUsername Username of the user who sent the message
 * @param destUsername Username of the user who's to receive the message
 */
export async function dm(message: string, senderUsername: string, destUsername: string): Promise<void> {
  try {
    const sender = await UserModel.findOne({ username: senderUsername })
    const dest = await UserModel.findOne({ username: destUsername })
    if (sender && dest && sender.friends.includes(dest.username)) {
      const newMessage = new MessageModel({
        content: message,
        users: [sender.username, dest.username],
        sender: sender.username
      })
      await newMessage.save()
    }
  } catch(err) {
    logger.prettyError(err)
  }
}