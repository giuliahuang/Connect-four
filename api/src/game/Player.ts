import { Socket } from "socket.io"

export interface Player {
  id: string
  mmr: number
  ws: Socket
}