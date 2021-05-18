import { Server as WebServer } from 'http'
import {Server as IOServer} from 'socket.io'

export type SetupT = {
  httpServer: WebServer,
  ioServer: IOServer
}