import { Schema, model } from 'mongoose'
import logger from '../logger/'
import { User } from './User'

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
      { sender: user1.email, recipient: user2.email },
      { sender: user2.email, recipient: user1.email }
    ]
  })
}