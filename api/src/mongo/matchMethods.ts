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
    const filterWinner = { username: res.winner }
    const updateWinner = { $inc: { mmr: MMR_INCR }, $push: { matchesPlayed: res } }
    await UserModel.findOneAndUpdate(filterWinner, updateWinner)

    const filterLoser = { username: res.loser, mmr: { $gte: MMR_DECR } }
    const updateLoser = { $inc: { mmr: -MMR_DECR }, $push: { matchesPlayed: res } }
    await UserModel.findOneAndUpdate(filterLoser, updateLoser)
  } catch (err) {
    logger.error(err)
  }
}