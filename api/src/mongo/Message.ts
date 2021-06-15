import mongoose from 'mongoose'
import { UserSchema } from './User'
import Message from '../models/Message'

const MessageSchema = new mongoose.Schema<Message>({
  content: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  users: {
    type: [UserSchema],
    required: true
  },
  sender: {
    type: UserSchema,
    required: true
  }
})

export const MessageModel = mongoose.model('Message', MessageSchema)