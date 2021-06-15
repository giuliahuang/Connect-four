import { Socket } from "socket.io"
import Player from "../Player"

export default interface UnmatchedPlayer {
  player: Player
  timeJoined: number
  ws: Socket | string
}