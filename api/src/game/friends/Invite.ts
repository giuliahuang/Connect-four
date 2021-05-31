import User from "../../models/User"
import UnmatchedPlayer from "../matchmaking/UnmatchedPlayer"

export default interface Invite {
  inviter: UnmatchedPlayer,
  invited: User
}