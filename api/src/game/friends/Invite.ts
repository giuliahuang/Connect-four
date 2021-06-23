import User from "../../models/User"
import PlayerWithWS from "../matchmaking/UnmatchedPlayer"

export default interface Invite {
  inviter: PlayerWithWS,
  invited: User
}