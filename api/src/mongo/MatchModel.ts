import mongoose from 'mongoose'
import MatchResult from '../models/Match'

export const matchSchema = new mongoose.Schema<MatchResult>({
  winner: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  },
  loser: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true
  }
})

const MatchModel = mongoose.model<MatchResult>('Match', matchSchema)

export default MatchModel