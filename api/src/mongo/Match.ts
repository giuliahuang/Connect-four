import mongoose from 'mongoose'
import MatchResults from '../models/MatchResults'

export const matchSchema = new mongoose.Schema<MatchResults>({
  winner: {
    type: mongoose.SchemaTypes.String,
    required: true
  },
  loser: {
    type: mongoose.SchemaTypes.String,
    required: true
  }
})

export const MatchModel = mongoose.model<MatchResults>('Match', matchSchema)