import { Schema, model } from 'mongoose'
import { Logger } from 'tslog'
import { User } from './User'

const logger = new Logger()

export interface Message {
  sender: string,
  recipient: string,
  content: string
}

const messageSchema = new Schema<Message>({
  sender: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
}, { timestamps: true })

export const MessageModel = model<Message>('Message', messageSchema)

export async function storeNewMessage(message: Message) {
  const doc = new MessageModel(message)
  try {
    const res = await doc.save()
    logger.info(res)
  } catch (err) {
    logger.error(err)
  }
}

export async function getMessageHistory(user1: User, user2: User): Promise<any> {
  return MessageModel.find({
    $or: [
      { sender: user1.mail, recipient: user2.mail },
      { sender: user2.mail, recipient: user1.mail }
    ]
  })
}