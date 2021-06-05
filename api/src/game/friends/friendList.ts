import { Server as IOServer, Socket } from "socket.io"
import logger from "../../logger"
import User from "../../models/User"
import { getFriends } from "../../mongo/friendsMethods"
import { dm } from "../../mongo/messageMethods"

export async function getOnlineFriends(socket: Socket): Promise<string[]> {
  let onlineFriends: string[] = []
  try {
    const friendsList = await getFriends(socket.request['user'])
    const onlineUsers = socket.rooms
    onlineUsers.forEach(user => {
      if (friendsList.includes(user)) onlineFriends.push(user)
    })
  } catch (err) {
    logger.error(err)
  }
  return onlineFriends
}

export function sendMessage(user: User, message: string, destUsername: string, socket: Socket) {
  if (user.friends.includes(destUsername)) {
    socket.to(destUsername).emit('dm', message)
    dm(message, user.username, destUsername)
  }
  else
    socket.to(user.username).emit('dm', `${destUsername} is not a valid friend`)
}

export async function disconnectClient(socket: Socket, reason: string, io: IOServer) {

}