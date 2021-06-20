import logger from "../logger"
import MatchResults from "../models/MatchResults"
import UserModel from "./User"

const MMR_INCR = 30
const MMR_DECR = 25

/**
 * Processes the results of the match and updates the users' mmr
 * @param res results of the match
 */
export async function endMatch(res: MatchResults): Promise<void> {
  try {
    await UserModel.findOneAndUpdate({ username: res.winner }, { $inc: { mmr: MMR_INCR }, $push: { matchesPlayed: res } })
    await UserModel.findOneAndUpdate({ username: res.loser }, { $inc: { mmr: -MMR_DECR }, $push: { matchesPlayed: res } })
  } catch (err) {
    logger.error(err)
  }
}