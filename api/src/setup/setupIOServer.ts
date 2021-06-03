import { Server as WebServer } from 'http'
import { Server as IOServer, Socket } from 'socket.io'
import { Logger } from 'tslog'
import { play } from '../game/matchmaking/matchmaking'

const logger = new Logger()

export function setupIOServer(httpServer: WebServer): IOServer {
  logger.info('Bootstrapping IO server')
  const io = new IOServer(httpServer, { cors: { origin: "*" } })

  io.on('connection', (socket) => {
    logger.info(`A new socket connection has been established by ${socket.id}`)

    //接收gameid
    socket.on('joinGame', (message) => {
      //加入gameid
      //socket.join(gameId);
      console.log(message);
      //信息发给client说有个玩家加入了同一个gameid
      //socket.to(gameId).emit('joinGame',"A player joined the game!");

      
    })

    socket.on('startGame', ({message}) => {
      play(socket,message)
      console.log("someone is starting the game")
    })


    // socket.emit('message', 'Hey I Just connected');

    // socket.broadcast.emit('message', "Hi this message is send to everyone except sender")

    // io.emit("This is send to everyone")

    // socket.join("HERE IS A UNIQUE ID FOR THE ROOM");

    // socket.to("UNIQUE ID").emit("message", "THIS MESSAGE WILL BE SEND TO EVERYONE IN THE ROOM EXCEPT THE SENDER")

    // io.to("UNIQUE ID").emit("message", "THIS MESSAGE WILL BE SEND TO EVERYONE IN THE ROOM")

  })

  return io
}