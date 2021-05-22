import { Server as WebServer } from 'http'
import { Server as IOServer } from 'socket.io'
import { Mongoose } from 'mongoose'

export type SetupT = {
  httpServer: WebServer,
  ioServer: IOServer,
  mongoServer: Mongoose | undefined
}