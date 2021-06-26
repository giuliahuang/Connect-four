import mongoose from 'mongoose'
import Message from '../models/Message'

const MessageSchema = new mongoose.Schema<Message>({
  content: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  users: {
    type: [mongoose.SchemaTypes.String],
    required: true
  },
  sender: {
    type: mongoose.SchemaTypes.String,
    required: true
  }
})

export const MessageModel = mongoose.model('Message', MessageSchema)