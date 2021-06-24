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
    await UserModel.findOne(filterWinner)

    const filterLoser = { username: res.loser }
    const updateLoser = { $push: { matchesPlayed: res } }
    await UserModel.findOneAndUpdate(filterLoser, updateLoser)

    const filterLoser2 = { username: res.loser, mmr: { $gte: MMR_DECR } }
    const updateLoser2 = { $inc: { mmr: -MMR_DECR } }
    await UserModel.findOneAndUpdate(filterLoser2, updateLoser2)
  } catch (err) {
    logger.error(err)
  }
}