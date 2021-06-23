import { Socket } from "socket.io"
import Player from "../Player"

export default interface PlayerWithWS {
  player: Player
  timeJoined: number
  ws: Socket | string
}