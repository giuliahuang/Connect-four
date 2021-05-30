import mongoose from 'mongoose'
import MatchResults from '../models/MatchResults'

export const matchSchema = new mongoose.Schema<MatchResults>({
  winner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  loser: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  }
})

export const MatchModel = mongoose.model<MatchResults>('Match', matchSchema)