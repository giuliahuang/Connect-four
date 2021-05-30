import logger from "../logger"
import MatchResults from "../models/MatchResults"
import { UserModel } from "./User"
import { decreaseMmr, increaseMmr } from "./userMethods"

const MMR_INCR = 30
const MMR_DECR = 25

export async function endMatch(res: MatchResults) {
  try {
    const winner = await UserModel.findById(res.winner)
    const loser = await UserModel.findById(res.loser)

    if (winner && loser) {
      winner.matchesPlayed.push(res)
      loser.matchesPlayed.push(res)

      increaseMmr(winner, MMR_INCR)
      decreaseMmr(loser, MMR_DECR)
      winner.update()
      loser.update()
    }
  } catch (err) {
    logger.error(err)
  }
}