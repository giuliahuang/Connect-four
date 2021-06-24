import mongoose from 'mongoose'
import User from '../models/User'
import { matchSchema } from './Match'

export const UserSchema = new mongoose.Schema<User>({
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
    type: [mongoose.SchemaTypes.String],
    default: []
  },
  receivedFriendReqs: {
    type: [mongoose.SchemaTypes.String],
    default: []
  },
  matchesPlayed: {
    type: [matchSchema],
    default: []
  },
  avatar: {
    type: mongoose.SchemaTypes.String,
    default: 'uploads/placeholder.jpg'
  },
  lastSeen: {
    type: mongoose.SchemaTypes.Number,
    default: null
  }
})

const UserModel = mongoose.model<User>('User', UserSchema)
export default UserModel