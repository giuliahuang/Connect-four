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
    required: true
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
    required: true
  },
  friends: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true
  },
  sentFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true
  },
  receivedFriendReqs: {
    type: [mongoose.SchemaTypes.ObjectId],
    required: true
  },
  matchesPlayed: {
    type: [matchSchema],
    required: true
  }
})

export const UserModel = mongoose.model<User>('User', userSchema)