import { UnmatchedPlayer } from "./UnmatchedPlayer"
import socket from 'socket.io'

export interface MatchingPlayer {
  player: UnmatchedPlayer
  ws: socket.Socket
}