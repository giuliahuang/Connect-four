import MatchResults from "../../models/MatchResults"

export default interface MoveResult {
  accepted: boolean,
  matchResult: MatchResults | undefined
}