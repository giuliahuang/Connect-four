import User from "../../models/User"

export default interface FriendRequest {
  source: User,
  destination: User
}