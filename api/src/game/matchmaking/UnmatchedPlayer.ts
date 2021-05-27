import { Socket } from "socket.io"
import { Player } from "../Player"

export interface UnmatchedPlayer {
  player: Player
  timeJoined: number
  ws: Socket
}