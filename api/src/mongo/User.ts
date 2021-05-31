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
    required: false,
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
    required: false,
    default: 0
  },
  friends: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: false,
    default: []
  },
  sentFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: false,
    default: []
  },
  receivedFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: false,
    default: []
  },
  matchesPlayed: {
    type: [matchSchema],
    required: false,
    default: []
  }
})

const UserModel = mongoose.model<User>('User', userSchema)
export default UserModel