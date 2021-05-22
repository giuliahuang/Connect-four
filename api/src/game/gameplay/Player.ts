import { Socket } from "socket.io"

export interface Player {
  id: number
  mmr: number
  ws: Socket
}