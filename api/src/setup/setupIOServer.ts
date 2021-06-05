import { Server as WebServer } from 'http'
import { Server as IOServer } from 'socket.io'
import jwtAuth from 'socketio-jwt-auth'
import { jwtCallback } from '../config/passport'
import { globalCallback } from '../game/socket/globalSocket'
import logger from '../logger/'
import UserModel from '../mongo/User'
/**
 * Creates a new Socket.io instance through either a webserver or a port and applies the auth middleware
 * @param httpServer required for binding the global Socket.io server
 */
export function createIOServer(httpServer: WebServer): IOServer
export function createIOServer(port: number): IOServer
export function createIOServer(param: any): IOServer {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(param, { cors: { origin: '*' } })

  // Socket.io middleware that provides authentication through the JWT token set into
  // the websocket request's auth headers
  io.use(jwtAuth.authenticate({
    secret: process.env.JWT_SECRET!,
    algorithm: 'HS256'
  }, function (payload, done) {
    UserModel.findOne({ _id: payload.sub }, function (err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        return done(null, false, 'Not authorized')
      }
      return done(null, user)
    })
  }))
  return io
}


export function setupGlobalIOServer(httpServer: WebServer): IOServer {
  const io = createIOServer(httpServer)
  io.on('connection', socket => globalCallback(io, socket))
  return io
}