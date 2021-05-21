import { Socket } from "socket.io"
import { UnmatchedPlayer } from "./UnmatchedPlayer"

export interface MatchingPlayer {
  player: UnmatchedPlayer,
  ws: Socket
}