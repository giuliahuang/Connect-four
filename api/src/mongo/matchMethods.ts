import logger from "../logger"
import MatchResults from "../models/MatchResults"
import { processResults } from "./userMethods"

/**
 * Processes the results of the match and updates the users' mmr
 * @param res results of the match
 */
export async function endMatch(res: MatchResults) {
  try {
    await processResults(res)
  } catch (err) {
    logger.error(err)
  }
}