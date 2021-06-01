import mongoose from 'mongoose'
import User from '../models/User'
import { matchSchema } from './Match'

const userSchema = new mongoose.Schema<User>({
  username: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  email: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true
  },
  roles: {
    type: [mongoose.SchemaTypes.String],
    default: []
  },
  salt: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  hash: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  mmr: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  friends: {
    type: [mongoose.SchemaTypes.String],
    default: []
  },
  sentFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: []
  },
  receivedFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    default: []
  },
  matchesPlayed: {
    type: [matchSchema],
    default: []
  },
  avatar: {
    type: mongoose.SchemaTypes.String,
    default: 'placeholder.jpg'
  },
  isFirstLogin: {
    type: mongoose.SchemaTypes.Boolean
  }
})

const UserModel = mongoose.model<User>('User', userSchema)
export default UserModel